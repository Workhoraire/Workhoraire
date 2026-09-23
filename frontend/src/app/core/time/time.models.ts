export type TimeEntrySource = 'CLOCK' | 'MANUAL';
export type AbsenceType =
  | 'PAID_LEAVE'
  | 'RTT'
  | 'SICK_LEAVE'
  | 'UNPAID_LEAVE'
  | 'FAMILY_EVENT'
  | 'OTHER';

export type ComplianceAlertCode =
  | 'OPEN_ENTRY_TOO_LONG'
  | 'DAILY_MAX_EXCEEDED'
  | 'MISSING_BREAK'
  | 'INSUFFICIENT_DAILY_REST'
  | 'WEEKLY_MAX_EXCEEDED'
  | 'TOO_MANY_WORKING_DAYS'
  | 'COMPLEMENTARY_HOURS_LIMIT'
  | 'WORK_DURING_ABSENCE';

export interface ComplianceAlert {
  code: ComplianceAlertCode;
  date: string;
  scope: 'DAY' | 'WEEK';
  value: number;
  limit: number;
}

export interface TimesheetEntry {
  id: string;
  startAt: string;
  endAt: string | null;
  durationMinutes: number;
  source: TimeEntrySource;
  note: string | null;
  isOpen: boolean;
  isCorrected: boolean;
}

export interface DayAbsence {
  id: string;
  type: AbsenceType;
  portion: number;
}

export interface TimesheetDay {
  date: string;
  weekday: number;
  publicHoliday: string | null;
  entries: TimesheetEntry[];
  workedMinutes: number;
  breakMinutes: number;
  firstStartAt: string | null;
  lastEndAt: string | null;
  absences: DayAbsence[];
  alerts: ComplianceAlert[];
}

export interface TimesheetWeek {
  weekStart: string;
  weekEnd: string;
  withinPeriod: boolean;
  workedMinutes: number;
  contractMinutes: number;
  workingDays: number;
  /** Paid leave counted toward the 35-hour overtime threshold. */
  paidLeaveCreditMinutes: number;
  overtime: { tier25Minutes: number; tier50Minutes: number };
  complementary: { tier10Minutes: number; tier25Minutes: number };
  absenceDays: number;
  alerts: ComplianceAlert[];
}

export interface TimesheetEmployee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  weeklyContractMinutes: number;
}

export interface EmployeeTimesheet {
  from: string;
  to: string;
  timezone: string;
  contractMinutes: number;
  employee: TimesheetEmployee;
  days: TimesheetDay[];
  weeks: TimesheetWeek[];
  totals: { workedMinutes: number; absenceDays: number; alertCount: number };
}

export interface TeamTimesheetRow {
  employee: TimesheetEmployee;
  days: Array<{
    date: string;
    workedMinutes: number;
    breakMinutes: number;
    firstStartAt: string | null;
    lastEndAt: string | null;
    absences: DayAbsence[];
    hasOpenEntry: boolean;
    alerts: ComplianceAlert[];
  }>;
  weeks: TimesheetWeek[];
  totals: { workedMinutes: number; absenceDays: number; alertCount: number };
}

export interface TeamTimesheet {
  from: string;
  to: string;
  timezone: string;
  publicHolidays: Array<{ date: string; name: string }>;
  rows: TeamTimesheetRow[];
}

export interface TimeEntry {
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

export interface ClockStatus {
  serverTime: string;
  timezone: string;
  openEntry: TimeEntry | null;
  today: TimesheetDay;
  week: TimesheetWeek;
  weekDays: Array<{
    date: string;
    workedMinutes: number;
    absences: DayAbsence[];
    publicHoliday: string | null;
  }>;
}

export interface PersonSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface EntrySnapshot {
  startAt: string;
  endAt: string | null;
  note: string | null;
}

export interface TimeEntryAuditLog {
  id: string;
  timeEntryId: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  reason: string;
  entryStartAt: string;
  before: EntrySnapshot | null;
  after: EntrySnapshot | null;
  createdAt: string;
  actor: PersonSummary;
  employee: PersonSummary;
}

export function overtimeMinutes(week: TimesheetWeek): number {
  return week.overtime.tier25Minutes + week.overtime.tier50Minutes;
}

export function complementaryMinutes(week: TimesheetWeek): number {
  return week.complementary.tier10Minutes + week.complementary.tier25Minutes;
}
