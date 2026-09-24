import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  TimeEntry,
  TimeEntryAuditAction,
  TimeEntrySource,
  UserRole,
} from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import {
  addDays,
  isSupportedInstant,
  startOfLocalDay,
  startOfWeek,
  toDateKey,
} from '../common/dates/local-date';
import { assertValidPeriod } from '../common/dates/period';
import { formatMailDay, formatMailPeriod, mailName } from '../notifications/mail-format';
import { correctionMail } from '../notifications/mail-templates';
import { MailService } from '../notifications/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { LABOR_RULES } from '../timesheets/labor-rules';
import { TimesheetsService } from '../timesheets/timesheets.service';
import {
  ClockDto,
  CloseOpenEntryDto,
  CreateTimeEntryDto,
  DeleteTimeEntryDto,
  UpdateTimeEntryDto,
} from './dto/time-entry.dto';
import {
  ClockStatusResponse,
  EntrySnapshot,
  TimeEntryAuditLogResponse,
  TimeEntryResponse,
  toEntrySnapshot,
  toTimeEntryResponse,
} from './time-entry.types';

/** No single work period may exceed 24 hours. */
const MAX_ENTRY_MS = 24 * 60 * 60 * 1000;
/** Beyond this, a clock-out "now" would record a forgotten exit as worked time. */
const MAX_CLOCK_OUT_MS = LABOR_RULES.forgottenClockOutMinutes * 60 * 1000;

const personSelect = { id: true, firstName: true, lastName: true } as const;

type Transaction = Prisma.TransactionClient;

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function isRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}

/** A correction of an employee's hours, as told to them by e-mail. */
interface CorrectionNotice {
  employeeId: string;
  action: TimeEntryAuditAction;
  before: EntrySnapshot | null;
  after: Pick<EntrySnapshot, 'startAt' | 'endAt'> | null;
  reason: string;
}

@Injectable()
export class TimeEntriesService {
  private readonly logger = new Logger(TimeEntriesService.name);
  /** Origin of the application, for the links sent by e-mail. */
  private readonly appUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly timesheetsService: TimesheetsService,
    private readonly mail: MailService,
    config: ConfigService,
  ) {
    this.appUrl = config.get<string>('FRONTEND_URL', 'http://localhost:4200');
  }

  async getClockStatus(user: ApplicationUser, now = new Date()): Promise<ClockStatusResponse> {
    const timezone = user.company.timezone;
    const today = toDateKey(now, timezone);
    const weekStart = startOfWeek(today);

    const [openEntry, timesheet] = await Promise.all([
      this.prisma.timeEntry.findUnique({ where: { openUserId: user.id } }),
      this.timesheetsService.getOwnTimesheet(user, weekStart, addDays(weekStart, 6), now),
    ]);

    return {
      serverTime: now.toISOString(),
      timezone,
      openEntry: openEntry ? toTimeEntryResponse(openEntry, now) : null,
      today: timesheet.days.find((day) => day.date === today)!,
      week: timesheet.weeks[0],
      weekDays: timesheet.days.map((day) => ({
        date: day.date,
        workedMinutes: day.workedMinutes,
        absences: day.absences,
        publicHoliday: day.publicHoliday,
      })),
    };
  }

  async clockIn(user: ApplicationUser, dto: ClockDto, now = new Date()): Promise<TimeEntryResponse> {
    try {
      const entry = await this.prisma.timeEntry.create({
        data: {
          companyId: user.companyId,
          userId: user.id,
          startAt: now,
          openUserId: user.id,
          source: TimeEntrySource.CLOCK,
          note: dto.note || null,
          createdById: user.id,
        },
      });

      return toTimeEntryResponse(entry, now);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('You are already clocked in');
      }
      throw error;
    }
  }

  async clockOut(user: ApplicationUser, dto: ClockDto, now = new Date()): Promise<TimeEntryResponse> {
    const openEntry = await this.prisma.timeEntry.findUnique({
      where: { openUserId: user.id },
    });

    if (!openEntry) {
      throw new ConflictException('You are not clocked in');
    }

    if (now <= openEntry.startAt) {
      throw new ConflictException('The clock-out time must be after the clock-in time');
    }

    if (now.getTime() - openEntry.startAt.getTime() > MAX_CLOCK_OUT_MS) {
      throw new ConflictException(
        'This entry has been open for more than 12 hours: declare its end time',
      );
    }

    try {
      const entry = await this.prisma.timeEntry.update({
        where: { id: openEntry.id, openUserId: user.id },
        data: {
          endAt: now,
          openUserId: null,
          note: dto.note || openEntry.note,
        },
      });

      return toTimeEntryResponse(entry, now);
    } catch (error: unknown) {
      if (isRecordNotFound(error)) {
        throw new ConflictException('You are not clocked in');
      }
      throw error;
    }
  }

  /** The employee declares the end of a forgotten entry; the change is audited. */
  async closeOwnOpenEntry(
    user: ApplicationUser,
    dto: CloseOpenEntryDto,
    now = new Date(),
  ): Promise<TimeEntryResponse> {
    const openEntry = await this.prisma.timeEntry.findUnique({
      where: { openUserId: user.id },
    });

    if (!openEntry) {
      throw new ConflictException('You are not clocked in');
    }

    const endAt = new Date(dto.endAt);
    this.assertValidInterval(openEntry.startAt, endAt, now);

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const entry = await transaction.timeEntry.update({
          where: { id: openEntry.id, openUserId: user.id },
          data: { endAt, openUserId: null },
        });

        await this.writeAuditLog(transaction, {
          actor: user,
          entry,
          action: TimeEntryAuditAction.UPDATED,
          reason: dto.reason,
          before: toEntrySnapshot(openEntry),
          after: toEntrySnapshot(entry),
        });

        return toTimeEntryResponse(entry, now);
      });
    } catch (error: unknown) {
      if (isRecordNotFound(error)) {
        throw new ConflictException('You are not clocked in');
      }
      throw error;
    }
  }

  async createEntry(
    actor: ApplicationUser,
    dto: CreateTimeEntryDto,
    now = new Date(),
  ): Promise<TimeEntryResponse> {
    this.assertCanManageEntriesOf(actor, dto.userId);

    const employee = await this.prisma.user.findFirst({
      where: { id: dto.userId, companyId: actor.companyId },
      select: { id: true },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);
    this.assertValidInterval(startAt, endAt, now);

    const created = await this.prisma.$transaction(async (transaction) => {
      await this.lockEmployee(transaction, employee.id);
      await this.assertNoOverlap(transaction, employee.id, startAt, endAt, now);

      const entry = await transaction.timeEntry.create({
        data: {
          companyId: actor.companyId,
          userId: employee.id,
          startAt,
          endAt,
          source: TimeEntrySource.MANUAL,
          note: dto.note || null,
          createdById: actor.id,
        },
      });

      await this.writeAuditLog(transaction, {
        actor,
        entry,
        action: TimeEntryAuditAction.CREATED,
        reason: dto.reason,
        before: null,
        after: toEntrySnapshot(entry),
      });

      return toTimeEntryResponse(entry, now);
    });

    this.notifyCorrection(actor, {
      employeeId: employee.id,
      action: TimeEntryAuditAction.CREATED,
      before: null,
      after: created,
      reason: dto.reason,
    });
    return created;
  }

  async updateEntry(
    actor: ApplicationUser,
    entryId: string,
    dto: UpdateTimeEntryDto,
    now = new Date(),
  ): Promise<TimeEntryResponse> {
    if (dto.startAt === undefined && dto.endAt === undefined && dto.note === undefined) {
      throw new BadRequestException('At least one of startAt, endAt or note is required');
    }

    const existing = await this.findCompanyEntry(actor, entryId);
    this.assertCanManageEntriesOf(actor, existing.userId);

    const startAt = dto.startAt !== undefined ? new Date(dto.startAt) : existing.startAt;
    const endAt = dto.endAt !== undefined ? new Date(dto.endAt) : existing.endAt;
    const timezone = actor.company.timezone;

    // Moving a period to another day would file its trail under a week the
    // employee is not looking at: delete it and create a new one instead.
    if (toDateKey(startAt, timezone) !== toDateKey(existing.startAt, timezone)) {
      throw new BadRequestException(
        'An entry cannot be moved to another day: delete it and create a new one',
      );
    }

    if (endAt) {
      this.assertValidInterval(startAt, endAt, now);
    } else {
      this.assertValidOpenStart(startAt, now);
    }

    const updated = await this.guardConcurrentChange(() =>
      this.prisma.$transaction(async (transaction) => {
        await this.lockEmployee(transaction, existing.userId);
        await this.assertNoOverlap(transaction, existing.userId, startAt, endAt ?? now, now, existing.id);

        // Only update the version that was checked: a concurrent clock-out or
        // correction makes this update fail instead of overwriting it.
        const entry = await transaction.timeEntry.update({
          where: { id: existing.id, updatedAt: existing.updatedAt },
          data: {
            startAt,
            endAt,
            openUserId: endAt ? null : existing.userId,
            ...(dto.note !== undefined ? { note: dto.note || null } : {}),
          },
        });

        await this.writeAuditLog(transaction, {
          actor,
          entry,
          action: TimeEntryAuditAction.UPDATED,
          reason: dto.reason,
          before: toEntrySnapshot(existing),
          after: toEntrySnapshot(entry),
        });

        return toTimeEntryResponse(entry, now);
      }),
    );

    this.notifyCorrection(actor, {
      employeeId: existing.userId,
      action: TimeEntryAuditAction.UPDATED,
      before: toEntrySnapshot(existing),
      after: updated,
      reason: dto.reason,
    });
    return updated;
  }

  async deleteEntry(actor: ApplicationUser, entryId: string, dto: DeleteTimeEntryDto): Promise<void> {
    const existing = await this.findCompanyEntry(actor, entryId);
    this.assertCanManageEntriesOf(actor, existing.userId);

    await this.guardConcurrentChange(() =>
      this.prisma.$transaction(async (transaction) => {
        await transaction.timeEntry.delete({
          where: { id: existing.id, updatedAt: existing.updatedAt },
        });
        await this.writeAuditLog(transaction, {
          actor,
          entry: existing,
          action: TimeEntryAuditAction.DELETED,
          reason: dto.reason,
          before: toEntrySnapshot(existing),
          after: null,
        });
      }),
    );

    this.notifyCorrection(actor, {
      employeeId: existing.userId,
      action: TimeEntryAuditAction.DELETED,
      before: toEntrySnapshot(existing),
      after: null,
      reason: dto.reason,
    });
  }

  /**
   * Tells the employee by e-mail about a correction of their hours, with its
   * reason (the trail also stays in "Mes heures"). Sent after the change is
   * saved, in the background: it never blocks nor undoes the correction.
   */
  private notifyCorrection(actor: ApplicationUser, notice: CorrectionNotice): void {
    if (!this.mail.enabled) {
      return;
    }
    void this.sendCorrectionMail(actor, notice).catch((error: unknown) =>
      this.logger.warn(
        `Correction e-mail not sent: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }

  private async sendCorrectionMail(actor: ApplicationUser, notice: CorrectionNotice): Promise<void> {
    const employee = await this.prisma.user.findFirst({
      where: { id: notice.employeeId, companyId: actor.companyId },
      select: { email: true, firstName: true, isActive: true },
    });
    if (!employee?.email || !employee.isActive) {
      return;
    }

    const timezone = actor.company.timezone;
    const period = notice.before ?? notice.after;
    if (!period) {
      return;
    }
    await this.mail.send(
      employee.email,
      correctionMail({
        firstName: employee.firstName,
        actorName: mailName(actor),
        action: notice.action,
        day: formatMailDay(new Date(period.startAt), timezone),
        before: notice.before ? formatMailPeriod(notice.before, timezone) : null,
        after: notice.after ? formatMailPeriod(notice.after, timezone) : null,
        reason: notice.reason,
        link: `${this.appUrl}/my-time`,
      }),
    );
  }

  /**
   * Audit trail of the entries starting in the period. Employees only see
   * their own trail; managers and administrators see the whole company.
   */
  async listAuditLogs(
    user: ApplicationUser,
    query: { from: string; to: string; employeeId?: string },
  ): Promise<TimeEntryAuditLogResponse[]> {
    assertValidPeriod(query.from, query.to);
    const canSeeTeam = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
    const employeeId = canSeeTeam ? query.employeeId : user.id;
    const timezone = user.company.timezone;

    const logs = await this.prisma.timeEntryAuditLog.findMany({
      where: {
        companyId: user.companyId,
        ...(employeeId ? { employeeId } : {}),
        entryStartAt: {
          gte: startOfLocalDay(query.from, timezone),
          lt: startOfLocalDay(addDays(query.to, 1), timezone),
        },
      },
      include: { actor: { select: personSelect }, employee: { select: personSelect } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return logs.map((log) => ({
      id: log.id,
      timeEntryId: log.timeEntryId,
      action: log.action,
      reason: log.reason,
      entryStartAt: log.entryStartAt.toISOString(),
      before: log.before as EntrySnapshot | null,
      after: log.after as EntrySnapshot | null,
      createdAt: log.createdAt.toISOString(),
      actor: log.actor,
      employee: log.employee,
    }));
  }

  /**
   * A manager may not correct their own hours (conflict of interest); an
   * administrator, who has no one above them in the application, may.
   */
  private assertCanManageEntriesOf(actor: ApplicationUser, employeeId: string): void {
    if (actor.role === UserRole.MANAGER && actor.id === employeeId) {
      throw new ForbiddenException('A manager cannot modify their own time entries');
    }
  }

  private async findCompanyEntry(actor: ApplicationUser, entryId: string): Promise<TimeEntry> {
    const entry = await this.prisma.timeEntry.findFirst({
      where: { id: entryId, companyId: actor.companyId },
    });

    if (!entry) {
      throw new NotFoundException('Time entry not found');
    }

    return entry;
  }

  /** Turns "the row changed or disappeared meanwhile" into a 409 instead of a 500. */
  private async guardConcurrentChange<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (isRecordNotFound(error)) {
        throw new ConflictException('This time entry has changed, reload it and retry');
      }
      throw error;
    }
  }

  /**
   * Serialises the changes of one employee's entries (row lock on the user),
   * so that two concurrent corrections cannot both pass the overlap check.
   */
  private async lockEmployee(transaction: Transaction, userId: string): Promise<void> {
    await transaction.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId}::uuid FOR UPDATE`;
  }

  private assertValidOpenStart(startAt: Date, now: Date): void {
    if (!isSupportedInstant(startAt)) {
      throw new BadRequestException('The start time is not a valid date');
    }
    if (startAt > now) {
      throw new BadRequestException('An entry cannot start in the future');
    }
    if (now.getTime() - startAt.getTime() > MAX_ENTRY_MS) {
      throw new BadRequestException('An entry cannot last more than 24 hours');
    }
  }

  private assertValidInterval(startAt: Date, endAt: Date, now: Date): void {
    if (!isSupportedInstant(startAt) || !isSupportedInstant(endAt)) {
      throw new BadRequestException('The start and end times must be valid dates');
    }
    if (endAt <= startAt) {
      throw new BadRequestException('The end time must be after the start time');
    }
    if (endAt > now) {
      throw new BadRequestException('An entry cannot end in the future');
    }
    if (endAt.getTime() - startAt.getTime() > MAX_ENTRY_MS) {
      throw new BadRequestException('An entry cannot last more than 24 hours');
    }
  }

  private async assertNoOverlap(
    transaction: Transaction,
    userId: string,
    startAt: Date,
    endAt: Date,
    now: Date,
    excludedEntryId?: string,
  ): Promise<void> {
    const overlapping = await transaction.timeEntry.findFirst({
      where: {
        userId,
        ...(excludedEntryId ? { id: { not: excludedEntryId } } : {}),
        startAt: { lt: endAt },
        OR: [{ endAt: { gt: startAt } }, { endAt: null, startAt: { lt: now } }],
      },
      select: { id: true },
    });

    if (overlapping) {
      throw new ConflictException('This period overlaps another time entry of the employee');
    }
  }

  private async writeAuditLog(
    transaction: Transaction,
    log: {
      actor: ApplicationUser;
      entry: TimeEntry;
      action: TimeEntryAuditAction;
      reason: string;
      before: EntrySnapshot | null;
      after: EntrySnapshot | null;
    },
  ): Promise<void> {
    await transaction.timeEntryAuditLog.create({
      data: {
        companyId: log.actor.companyId,
        timeEntryId: log.entry.id,
        employeeId: log.entry.userId,
        actorId: log.actor.id,
        action: log.action,
        reason: log.reason,
        entryStartAt: log.entry.startAt,
        before: log.before ?? Prisma.DbNull,
        after: log.after ?? Prisma.DbNull,
      },
    });
  }
}
