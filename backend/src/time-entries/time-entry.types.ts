import { TimeEntry, TimeEntryAuditAction, TimeEntrySource } from '@prisma/client';
import {
  TimesheetDay,
  TimesheetDayAbsence,
  TimesheetWeek,
} from '../timesheets/timesheet.types';

export interface TimeEntryResponse {
  id: string;
  userId: string;
  startAt: string;
  endAt: string | null;
  durationMinutes: number;
  source: TimeEntrySource;
  note: string | null;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A type alias (not an interface) so that it is assignable to Prisma JSON input. */
export type EntrySnapshot = {
  startAt: string;
  endAt: string | null;
  note: string | null;
};

export interface PersonSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface TimeEntryAuditLogResponse {
  id: string;
  timeEntryId: string;
  action: TimeEntryAuditAction;
  reason: string;
  entryStartAt: string;
  before: EntrySnapshot | null;
  after: EntrySnapshot | null;
  createdAt: string;
  actor: PersonSummary;
  employee: PersonSummary;
}

export interface ClockStatusResponse {
  /** Server clock, so that the client can display a reliable running timer. */
  serverTime: string;
  timezone: string;
  openEntry: TimeEntryResponse | null;
  today: TimesheetDay;
  week: TimesheetWeek;
  /** Monday to Sunday of the current week. */
  weekDays: Array<{
    date: string;
    workedMinutes: number;
    absences: TimesheetDayAbsence[];
    publicHoliday: string | null;
  }>;
}

export function toEntrySnapshot(
  entry: Pick<TimeEntry, 'startAt' | 'endAt' | 'note'>,
): EntrySnapshot {
  return {
    startAt: entry.startAt.toISOString(),
    endAt: entry.endAt?.toISOString() ?? null,
    note: entry.note,
  };
}

export function toTimeEntryResponse(entry: TimeEntry, now = new Date()): TimeEntryResponse {
  const end = entry.endAt ?? now;
  const minutes =
    Math.floor(end.getTime() / 60_000) - Math.floor(entry.startAt.getTime() / 60_000);

  return {
    id: entry.id,
    userId: entry.userId,
    startAt: entry.startAt.toISOString(),
    endAt: entry.endAt?.toISOString() ?? null,
    durationMinutes: Math.max(0, minutes),
    source: entry.source,
    note: entry.note,
    isOpen: entry.endAt === null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
