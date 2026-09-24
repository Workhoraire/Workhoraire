import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AbsenceRequest,
  AbsenceStatus,
  ContractPeriod,
  Prisma,
  TimeEntry,
} from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import {
  addDays,
  dateColumnToKey,
  dateKeyToDateColumn,
  eachDateKey,
  startOfLocalDay,
} from '../common/dates/local-date';
import { assertValidPeriod } from '../common/dates/period';
import { publicHolidayName } from '../common/dates/public-holidays';
import { PrismaService } from '../prisma/prisma.service';
import {
  CalculatorAbsence,
  CalculatorEntry,
  ContractSpan,
  calculateTimesheet,
  computedRange,
} from './timesheet.calculator';
import {
  EmployeeTimesheet,
  TeamTimesheet,
  TimesheetEmployee,
} from './timesheet.types';

export const timesheetEmployeeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  isActive: true,
  weeklyContractMinutes: true,
  payrollId: true,
} as const satisfies Prisma.UserSelect;

interface LoadedData {
  entries: TimeEntry[];
  absences: AbsenceRequest[];
  contracts: ContractPeriod[];
  correctedIds: Set<string>;
}

@Injectable()
export class TimesheetsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Timesheet of the authenticated user. */
  async getOwnTimesheet(
    user: ApplicationUser,
    from: string,
    to: string,
    now = new Date(),
  ): Promise<EmployeeTimesheet> {
    assertValidPeriod(from, to);
    const employee: TimesheetEmployee = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      weeklyContractMinutes: user.weeklyContractMinutes,
      payrollId: user.payrollId,
    };

    return this.buildEmployeeTimesheet(user, employee, from, to, now);
  }

  /** Timesheet of an employee of the manager's company. */
  async getEmployeeTimesheet(
    actor: ApplicationUser,
    employeeId: string,
    from: string,
    to: string,
    now = new Date(),
  ): Promise<EmployeeTimesheet> {
    assertValidPeriod(from, to);
    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: actor.companyId },
      select: timesheetEmployeeSelect,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.buildEmployeeTimesheet(actor, employee, from, to, now);
  }

  /** Timesheets of every active employee, plus inactive ones with work or absences in the period. */
  async getTeamTimesheet(
    actor: ApplicationUser,
    from: string,
    to: string,
    now = new Date(),
  ): Promise<TeamTimesheet> {
    assertValidPeriod(from, to);
    const timezone = actor.company.timezone;
    const bounds = this.queryBounds(from, to, timezone);
    const range = computedRange(from, to);

    const [employees, data] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          companyId: actor.companyId,
          OR: [
            { isActive: true },
            { timeEntries: { some: { startAt: { gte: bounds.start, lt: bounds.end } } } },
            {
              absenceRequests: {
                some: {
                  status: AbsenceStatus.APPROVED,
                  startDate: { lte: dateKeyToDateColumn(range.to) },
                  endDate: { gte: dateKeyToDateColumn(range.from) },
                },
              },
            },
          ],
        },
        select: timesheetEmployeeSelect,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      this.loadData(actor.companyId, undefined, from, to, timezone),
    ]);

    const rows = employees.map((employee) => {
      const timesheet = calculateTimesheet({
        from,
        to,
        timezone,
        contractMinutes: employee.weeklyContractMinutes,
        contracts: this.toContractSpans(
          data.contracts.filter((contract) => contract.userId === employee.id),
        ),
        entries: this.toCalculatorEntries(
          data.entries.filter((entry) => entry.userId === employee.id),
          data.correctedIds,
        ),
        absences: this.toCalculatorAbsences(
          data.absences.filter((absence) => absence.userId === employee.id),
        ),
        now,
      });

      return {
        employee,
        days: timesheet.days.map((day) => ({
          date: day.date,
          workedMinutes: day.workedMinutes,
          breakMinutes: day.breakMinutes,
          firstStartAt: day.firstStartAt,
          lastEndAt: day.lastEndAt,
          absences: day.absences,
          hasOpenEntry: day.entries.some((entry) => entry.isOpen),
          alerts: day.alerts,
        })),
        weeks: timesheet.weeks,
        totals: timesheet.totals,
      };
    });

    return {
      from,
      to,
      timezone,
      publicHolidays: eachDateKey(from, to)
        .map((date) => ({ date, name: publicHolidayName(date) }))
        .filter((holiday): holiday is { date: string; name: string } => holiday.name !== null),
      rows,
    };
  }

  private async buildEmployeeTimesheet(
    actor: ApplicationUser,
    employee: TimesheetEmployee,
    from: string,
    to: string,
    now: Date,
  ): Promise<EmployeeTimesheet> {
    const timezone = actor.company.timezone;
    const data = await this.loadData(actor.companyId, employee.id, from, to, timezone);
    const timesheet = calculateTimesheet({
      from,
      to,
      timezone,
      contractMinutes: employee.weeklyContractMinutes,
      contracts: this.toContractSpans(data.contracts),
      entries: this.toCalculatorEntries(data.entries, data.correctedIds),
      absences: this.toCalculatorAbsences(data.absences),
      now,
    });

    return { ...timesheet, employee };
  }

  /**
   * Instants covering the computed weeks, plus the previous day so that the
   * daily rest of the first day can be checked.
   */
  private queryBounds(from: string, to: string, timezone: string): { start: Date; end: Date } {
    const range = computedRange(from, to);
    return {
      start: startOfLocalDay(addDays(range.from, -1), timezone),
      end: startOfLocalDay(addDays(range.to, 1), timezone),
    };
  }

  private async loadData(
    companyId: string,
    userId: string | undefined,
    from: string,
    to: string,
    timezone: string,
  ): Promise<LoadedData> {
    const range = computedRange(from, to);
    const bounds = this.queryBounds(from, to, timezone);

    const [entries, absences, contracts] = await Promise.all([
      this.prisma.timeEntry.findMany({
        where: {
          companyId,
          ...(userId ? { userId } : {}),
          startAt: { gte: bounds.start, lt: bounds.end },
        },
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.absenceRequest.findMany({
        where: {
          companyId,
          ...(userId ? { userId } : {}),
          status: AbsenceStatus.APPROVED,
          startDate: { lte: dateKeyToDateColumn(range.to) },
          endDate: { gte: dateKeyToDateColumn(range.from) },
        },
      }),
      this.prisma.contractPeriod.findMany({
        where: { companyId, ...(userId ? { userId } : {}) },
        orderBy: { effectiveFrom: 'asc' },
      }),
    ]);

    const correctedIds = new Set<string>();
    if (entries.length > 0) {
      const logs = await this.prisma.timeEntryAuditLog.findMany({
        where: { companyId, timeEntryId: { in: entries.map((entry) => entry.id) } },
        select: { timeEntryId: true },
        distinct: ['timeEntryId'],
      });
      logs.forEach((log) => correctedIds.add(log.timeEntryId));
    }

    return { entries, absences, contracts, correctedIds };
  }

  private toCalculatorEntries(entries: TimeEntry[], correctedIds: Set<string>): CalculatorEntry[] {
    return entries.map((entry) => ({
      id: entry.id,
      startAt: entry.startAt,
      endAt: entry.endAt,
      source: entry.source,
      note: entry.note,
      isCorrected: correctedIds.has(entry.id),
    }));
  }

  private toContractSpans(contracts: ContractPeriod[]): ContractSpan[] {
    return contracts.map((contract) => ({
      from: dateColumnToKey(contract.effectiveFrom),
      minutes: contract.weeklyContractMinutes,
    }));
  }

  private toCalculatorAbsences(absences: AbsenceRequest[]): CalculatorAbsence[] {
    return absences.map((absence) => ({
      id: absence.id,
      type: absence.type,
      startDate: dateColumnToKey(absence.startDate),
      endDate: dateColumnToKey(absence.endDate),
      startsAfternoon: absence.startsAfternoon,
      endsMorning: absence.endsMorning,
    }));
  }
}
