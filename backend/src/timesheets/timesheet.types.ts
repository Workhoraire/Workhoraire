import { AbsenceType, TimeEntrySource } from '@prisma/client';

export type ComplianceAlertCode =
  | 'OPEN_ENTRY_TOO_LONG'
  | 'DAILY_MAX_EXCEEDED'
  | 'MISSING_BREAK'
  | 'INSUFFICIENT_DAILY_REST'
  | 'WEEKLY_MAX_EXCEEDED'
  | 'TOO_MANY_WORKING_DAYS'
  | 'COMPLEMENTARY_HOURS_LIMIT';

export interface ComplianceAlert {
  code: ComplianceAlertCode;
  /** Day concerned, or the Monday of the week for weekly alerts. */
  date: string;
  scope: 'DAY' | 'WEEK';
  /** Measured value, in minutes (or days for TOO_MANY_WORKING_DAYS). */
  value: number;
  /** Legal or product threshold, in the same unit. */
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

export interface TimesheetDayAbsence {
  id: string;
  type: AbsenceType;
  /** 1 for a full day, 0.5 for a half day. */
  portion: number;
}

export interface TimesheetDay {
  date: string;
  /** ISO weekday, 1 (Monday) to 7 (Sunday). */
  weekday: number;
  publicHoliday: string | null;
  entries: TimesheetEntry[];
  workedMinutes: number;
  breakMinutes: number;
  firstStartAt: string | null;
  lastEndAt: string | null;
  absences: TimesheetDayAbsence[];
  alerts: ComplianceAlert[];
}

export interface TimesheetWeek {
  /** Monday of the civil week. */
  weekStart: string;
  /** Sunday of the civil week. */
  weekEnd: string;
  /** True when the whole week is inside the requested period. */
  withinPeriod: boolean;
  workedMinutes: number;
  contractMinutes: number;
  workingDays: number;
  /** Paid leave counted toward the overtime threshold (full-time only). */
  paidLeaveCreditMinutes: number;
  /** Full-time employees: hours beyond the legal 35 hours, paid leave included. */
  overtime: {
    tier25Minutes: number;
    tier50Minutes: number;
  };
  /** Part-time employees: hours beyond the contractual time. */
  complementary: {
    tier10Minutes: number;
    tier25Minutes: number;
  };
  absenceDays: number;
  alerts: ComplianceAlert[];
}

export interface TimesheetTotals {
  workedMinutes: number;
  absenceDays: number;
  alertCount: number;
}

export interface Timesheet {
  from: string;
  to: string;
  timezone: string;
  contractMinutes: number;
  days: TimesheetDay[];
  weeks: TimesheetWeek[];
  totals: TimesheetTotals;
}

export interface TimesheetEmployee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  weeklyContractMinutes: number;
  payrollId: string | null;
}

export interface EmployeeTimesheet extends Timesheet {
  employee: TimesheetEmployee;
}

export interface TeamTimesheetRow {
  employee: TimesheetEmployee;
  days: Array<{
    date: string;
    workedMinutes: number;
    breakMinutes: number;
    firstStartAt: string | null;
    lastEndAt: string | null;
    absences: TimesheetDayAbsence[];
    hasOpenEntry: boolean;
    alerts: ComplianceAlert[];
  }>;
  weeks: TimesheetWeek[];
  totals: TimesheetTotals;
}

export interface TeamTimesheet {
  from: string;
  to: string;
  timezone: string;
  publicHolidays: Array<{ date: string; name: string }>;
  rows: TeamTimesheetRow[];
}
