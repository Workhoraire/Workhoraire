import { Injectable } from '@nestjs/common';
import { AbsenceStatus, AbsenceType } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { addDays, startOfWeek, toDateKey } from '../common/dates/local-date';
import { PrismaService } from '../prisma/prisma.service';
import { PersonSummary } from '../time-entries/time-entry.types';
import { LABOR_RULES } from '../timesheets/labor-rules';
import { ComplianceAlert, TimesheetEmployee } from '../timesheets/timesheet.types';
import { TimesheetsService } from '../timesheets/timesheets.service';

export interface TeamDashboardResponse {
  date: string;
  timezone: string;
  activeEmployees: number;
  presentNow: Array<{ employee: PersonSummary; since: string; isOverdue: boolean }>;
  todayWorkedMinutes: number;
  absentToday: Array<{ employee: PersonSummary; type: AbsenceType; portion: number }>;
  pendingAbsenceRequests: number;
  week: {
    weekStart: string;
    weekEnd: string;
    workedMinutes: number;
    overtimeMinutes: number;
    complementaryMinutes: number;
  };
  alerts: Array<{ employee: PersonSummary; alert: ComplianceAlert }>;
}

const MAX_ALERTS = 50;

function toPerson(employee: TimesheetEmployee | PersonSummary): PersonSummary {
  return { id: employee.id, firstName: employee.firstName, lastName: employee.lastName };
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timesheetsService: TimesheetsService,
  ) {}

  async getTeamDashboard(actor: ApplicationUser, now = new Date()): Promise<TeamDashboardResponse> {
    const timezone = actor.company.timezone;
    const today = toDateKey(now, timezone);
    const weekStart = startOfWeek(today);
    const weekEnd = addDays(weekStart, 6);

    const [team, openEntries, pendingAbsenceRequests] = await Promise.all([
      this.timesheetsService.getTeamTimesheet(actor, weekStart, weekEnd, now),
      this.prisma.timeEntry.findMany({
        where: { companyId: actor.companyId, endAt: null },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.absenceRequest.count({
        where: { companyId: actor.companyId, status: AbsenceStatus.PENDING },
      }),
    ]);

    const todayRows = team.rows.map((row) => ({
      row,
      day: row.days.find((day) => day.date === today),
    }));

    const alerts = team.rows
      .flatMap((row) => [
        ...row.days
          .filter((day) => day.date <= today)
          .flatMap((day) => day.alerts.map((alert) => ({ employee: toPerson(row.employee), alert }))),
        ...row.weeks.flatMap((week) =>
          week.alerts.map((alert) => ({ employee: toPerson(row.employee), alert })),
        ),
      ])
      .sort((left, right) => right.alert.date.localeCompare(left.alert.date))
      .slice(0, MAX_ALERTS);

    return {
      date: today,
      timezone,
      activeEmployees: team.rows.filter((row) => row.employee.isActive).length,
      presentNow: openEntries.map((entry) => ({
        employee: entry.user,
        since: entry.startAt.toISOString(),
        isOverdue:
          now.getTime() - entry.startAt.getTime() > LABOR_RULES.forgottenClockOutMinutes * 60_000,
      })),
      todayWorkedMinutes: todayRows.reduce((total, item) => total + (item.day?.workedMinutes ?? 0), 0),
      absentToday: todayRows.flatMap((item) =>
        (item.day?.absences ?? []).map((absence) => ({
          employee: toPerson(item.row.employee),
          type: absence.type,
          portion: absence.portion,
        })),
      ),
      pendingAbsenceRequests,
      week: {
        weekStart,
        weekEnd,
        workedMinutes: team.rows.reduce((total, row) => total + (row.weeks[0]?.workedMinutes ?? 0), 0),
        overtimeMinutes: team.rows.reduce(
          (total, row) =>
            total + (row.weeks[0] ? row.weeks[0].overtime.tier25Minutes + row.weeks[0].overtime.tier50Minutes : 0),
          0,
        ),
        complementaryMinutes: team.rows.reduce(
          (total, row) =>
            total +
            (row.weeks[0]
              ? row.weeks[0].complementary.tier10Minutes + row.weeks[0].complementary.tier25Minutes
              : 0),
          0,
        ),
      },
      alerts,
    };
  }
}
