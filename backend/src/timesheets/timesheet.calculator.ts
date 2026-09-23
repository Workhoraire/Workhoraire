import { AbsenceType, TimeEntrySource } from '@prisma/client';
import {
  addDays,
  eachDateKey,
  isoWeekday,
  startOfLocalDay,
  startOfWeek,
  toDateKey,
} from '../common/dates/local-date';
import { publicHolidayName } from '../common/dates/public-holidays';
import { LABOR_RULES } from './labor-rules';
import {
  ComplianceAlert,
  Timesheet,
  TimesheetDay,
  TimesheetDayAbsence,
  TimesheetEntry,
  TimesheetWeek,
} from './timesheet.types';

const MINUTE_MS = 60_000;

export interface CalculatorEntry {
  id: string;
  startAt: Date;
  endAt: Date | null;
  source: TimeEntrySource;
  note: string | null;
  isCorrected: boolean;
}

export interface CalculatorAbsence {
  id: string;
  type: AbsenceType;
  startDate: string;
  endDate: string;
  startsAfternoon: boolean;
  endsMorning: boolean;
}

/** Contractual weekly time applicable from a given Monday. */
export interface ContractSpan {
  from: string;
  minutes: number;
}

export interface TimesheetInput {
  from: string;
  to: string;
  timezone: string;
  /** Contract in force today, used when no dated contract applies. */
  contractMinutes: number;
  /** Dated contract history: each week uses the contract in force on its Monday. */
  contracts?: ContractSpan[];
  /** Entries starting from the day before the Monday of the first week. */
  entries: CalculatorEntry[];
  /** Approved absences overlapping the computed weeks. */
  absences: CalculatorAbsence[];
  now: Date;
}

/** Whole minutes between two instants, both truncated to the minute. */
function minutesBetween(start: Date, end: Date): number {
  const startMinute = Math.floor(start.getTime() / MINUTE_MS);
  const endMinute = Math.floor(end.getTime() / MINUTE_MS);

  return Math.max(0, endMinute - startMinute);
}

/** The weeks to compute: complete civil weeks covering the period. */
export function computedRange(from: string, to: string): { from: string; to: string } {
  return { from: startOfWeek(from), to: addDays(startOfWeek(to), 6) };
}

/** Contract in force during the week starting on `weekStart`. */
export function contractMinutesAt(
  contracts: ContractSpan[],
  weekStart: string,
  fallback: number,
): number {
  let applicable: ContractSpan | null = null;
  let earliest: ContractSpan | null = null;

  for (const contract of contracts) {
    if (contract.from <= weekStart && (!applicable || contract.from > applicable.from)) {
      applicable = contract;
    }
    if (!earliest || contract.from < earliest.from) {
      earliest = contract;
    }
  }

  return (applicable ?? earliest)?.minutes ?? fallback;
}

export function isWorkingDay(dateKey: string): boolean {
  return isoWeekday(dateKey) <= 5 && publicHolidayName(dateKey) === null;
}

/**
 * Portion of a working day covered by an absence: 1, 0.5 or 0. Weekends and
 * public holidays are never counted, as days are counted in "jours ouvrés".
 */
export function absencePortion(absence: CalculatorAbsence, dateKey: string): number {
  if (dateKey < absence.startDate || dateKey > absence.endDate || !isWorkingDay(dateKey)) {
    return 0;
  }

  let portion = 1;
  if (dateKey === absence.startDate && absence.startsAfternoon) {
    portion -= 0.5;
  }
  if (dateKey === absence.endDate && absence.endsMorning) {
    portion -= 0.5;
  }

  return Math.max(0, portion);
}

/** Working days ("jours ouvrés") covered by an absence request. */
export function countAbsenceDays(absence: CalculatorAbsence): number {
  return eachDateKey(absence.startDate, absence.endDate).reduce(
    (total, dateKey) => total + absencePortion(absence, dateKey),
    0,
  );
}

interface NormalizedEntry {
  source: CalculatorEntry;
  dateKey: string;
  effectiveEnd: Date;
  durationMinutes: number;
}

function absenceTotal(day: TimesheetDay): number {
  return day.absences.reduce((sum, absence) => sum + absence.portion, 0);
}

/** A full day of absence on which work was recorded is contradictory data. */
function isWorkedFullDayAbsence(day: TimesheetDay): boolean {
  return day.workedMinutes > 0 && absenceTotal(day) >= 1;
}

function buildDay(dateKey: string, entries: NormalizedEntry[], absences: CalculatorAbsence[], now: Date): TimesheetDay {
  const sorted = [...entries].sort(
    (left, right) => left.source.startAt.getTime() - right.source.startAt.getTime(),
  );
  let workedMinutes = 0;
  let breakMinutes = 0;
  let longestBreak = 0;

  sorted.forEach((entry, index) => {
    workedMinutes += entry.durationMinutes;

    if (index > 0) {
      const gap = minutesBetween(sorted[index - 1].effectiveEnd, entry.source.startAt);
      breakMinutes += gap;
      longestBreak = Math.max(longestBreak, gap);
    }
  });

  const alerts: ComplianceAlert[] = [];

  for (const entry of sorted) {
    const openMinutes = minutesBetween(entry.source.startAt, now);
    if (entry.source.endAt === null && openMinutes > LABOR_RULES.forgottenClockOutMinutes) {
      alerts.push({
        code: 'OPEN_ENTRY_TOO_LONG',
        date: dateKey,
        scope: 'DAY',
        value: openMinutes,
        limit: LABOR_RULES.forgottenClockOutMinutes,
      });
    }
  }

  if (workedMinutes > LABOR_RULES.maxDailyMinutes) {
    alerts.push({
      code: 'DAILY_MAX_EXCEEDED',
      date: dateKey,
      scope: 'DAY',
      value: workedMinutes,
      limit: LABOR_RULES.maxDailyMinutes,
    });
  }

  if (
    workedMinutes >= LABOR_RULES.breakRequiredAfterMinutes &&
    longestBreak < LABOR_RULES.minimumBreakMinutes
  ) {
    alerts.push({
      code: 'MISSING_BREAK',
      date: dateKey,
      scope: 'DAY',
      value: longestBreak,
      limit: LABOR_RULES.minimumBreakMinutes,
    });
  }

  const dayAbsences: TimesheetDayAbsence[] = absences
    .map((absence) => ({
      id: absence.id,
      type: absence.type,
      portion: absencePortion(absence, dateKey),
    }))
    .filter((absence) => absence.portion > 0);

  const entryViews: TimesheetEntry[] = sorted.map((entry) => ({
    id: entry.source.id,
    startAt: entry.source.startAt.toISOString(),
    endAt: entry.source.endAt?.toISOString() ?? null,
    durationMinutes: entry.durationMinutes,
    source: entry.source.source,
    note: entry.source.note,
    isOpen: entry.source.endAt === null,
    isCorrected: entry.source.isCorrected,
  }));

  const lastEnd = sorted.reduce<Date | null>(
    (latest, entry) =>
      latest === null || entry.effectiveEnd > latest ? entry.effectiveEnd : latest,
    null,
  );

  const day: TimesheetDay = {
    date: dateKey,
    weekday: isoWeekday(dateKey),
    publicHoliday: publicHolidayName(dateKey),
    entries: entryViews,
    workedMinutes,
    breakMinutes,
    firstStartAt: sorted[0]?.source.startAt.toISOString() ?? null,
    lastEndAt: sorted.length > 0 && lastEnd ? lastEnd.toISOString() : null,
    absences: dayAbsences,
    alerts,
  };

  if (isWorkedFullDayAbsence(day)) {
    alerts.push({
      code: 'WORK_DURING_ABSENCE',
      date: dateKey,
      scope: 'DAY',
      value: workedMinutes,
      limit: 0,
    });
  }

  return day;
}

/**
 * Worked minutes per civil week. Weeks run from Monday 0:00 to Sunday 24:00
 * local time (L3121-35): a night shift crossing into Monday is split, even
 * though the whole shift is displayed on the day it started.
 */
function workedMinutesByWeek(entries: NormalizedEntry[], timezone: string): Map<string, number> {
  const totals = new Map<string, number>();

  for (const entry of entries) {
    let weekStart = startOfWeek(entry.dateKey);
    let segmentStart = entry.source.startAt;

    while (segmentStart < entry.effectiveEnd) {
      const nextWeekStart = addDays(weekStart, 7);
      const boundary = startOfLocalDay(nextWeekStart, timezone);
      const segmentEnd = entry.effectiveEnd < boundary ? entry.effectiveEnd : boundary;

      totals.set(weekStart, (totals.get(weekStart) ?? 0) + minutesBetween(segmentStart, segmentEnd));
      segmentStart = segmentEnd;
      weekStart = nextWeekStart;
    }
  }

  return totals;
}

function buildWeek(
  weekStart: string,
  days: TimesheetDay[],
  workedMinutes: number,
  contractMinutes: number,
  period: { from: string; to: string },
): TimesheetWeek {
  const weekEnd = addDays(weekStart, 6);
  const workingDays = days.filter((day) => day.workedMinutes > 0).length;
  const absenceDays = days.reduce((total, day) => total + absenceTotal(day), 0);
  const alerts: ComplianceAlert[] = [];

  const isPartTime = contractMinutes < LABOR_RULES.legalWeeklyMinutes;
  const overtime = { tier25Minutes: 0, tier50Minutes: 0 };
  const complementary = { tier10Minutes: 0, tier25Minutes: 0 };
  // A day of leave on which work was recorded is not credited: the leave was
  // not really taken and crediting it would invent overtime.
  const paidLeaveDays = days
    .filter((day) => !isWorkedFullDayAbsence(day))
    .reduce(
      (total, day) =>
        total +
        day.absences
          .filter((absence) => absence.type === AbsenceType.PAID_LEAVE)
          .reduce((sum, absence) => sum + absence.portion, 0),
      0,
    );
  const paidLeaveCreditMinutes = isPartTime
    ? 0
    : Math.round((paidLeaveDays * contractMinutes) / LABOR_RULES.paidLeaveWorkingDaysPerWeek);

  if (isPartTime) {
    const extra = Math.max(0, workedMinutes - contractMinutes);
    const firstTierLimit = Math.floor(contractMinutes * LABOR_RULES.complementaryFirstTierRatio);
    complementary.tier10Minutes = Math.min(extra, firstTierLimit);
    complementary.tier25Minutes = extra - complementary.tier10Minutes;

    if (extra > firstTierLimit) {
      alerts.push({
        code: 'COMPLEMENTARY_HOURS_LIMIT',
        date: weekStart,
        scope: 'WEEK',
        value: extra,
        limit: firstTierLimit,
      });
    }
  } else {
    const extra = Math.max(
      0,
      workedMinutes + paidLeaveCreditMinutes - LABOR_RULES.legalWeeklyMinutes,
    );
    overtime.tier25Minutes = Math.min(extra, LABOR_RULES.overtimeFirstTierMinutes);
    overtime.tier50Minutes = extra - overtime.tier25Minutes;
  }

  if (workedMinutes > LABOR_RULES.maxWeeklyMinutes) {
    alerts.push({
      code: 'WEEKLY_MAX_EXCEEDED',
      date: weekStart,
      scope: 'WEEK',
      value: workedMinutes,
      limit: LABOR_RULES.maxWeeklyMinutes,
    });
  }

  if (workingDays > LABOR_RULES.maxWorkingDaysPerWeek) {
    alerts.push({
      code: 'TOO_MANY_WORKING_DAYS',
      date: weekStart,
      scope: 'WEEK',
      value: workingDays,
      limit: LABOR_RULES.maxWorkingDaysPerWeek,
    });
  }

  return {
    weekStart,
    weekEnd,
    withinPeriod: weekStart >= period.from && weekEnd <= period.to,
    workedMinutes,
    contractMinutes,
    workingDays,
    paidLeaveCreditMinutes,
    overtime,
    complementary,
    absenceDays,
    alerts,
  };
}

/**
 * Computes a timesheet: entries are displayed on the local day on which they
 * start, weekly totals use complete civil weeks (Monday to Sunday) with the
 * contract in force each week, and open entries are counted until `now`.
 */
export function calculateTimesheet(input: TimesheetInput): Timesheet {
  const range = computedRange(input.from, input.to);
  const dateKeys = eachDateKey(range.from, range.to);
  const entriesByDay = new Map<string, NormalizedEntry[]>(dateKeys.map((key) => [key, []]));
  const contracts = input.contracts ?? [];

  const normalized: NormalizedEntry[] = input.entries
    .map((entry) => {
      // A running entry counts until now; a forgotten one (open for too long)
      // counts nothing until someone declares its real end: never invent hours.
      const forgotten =
        entry.endAt === null &&
        minutesBetween(entry.startAt, input.now) > LABOR_RULES.forgottenClockOutMinutes;
      const effectiveEnd =
        entry.endAt ?? (forgotten || input.now <= entry.startAt ? entry.startAt : input.now);
      return {
        source: entry,
        dateKey: toDateKey(entry.startAt, input.timezone),
        effectiveEnd,
        durationMinutes: minutesBetween(entry.startAt, effectiveEnd),
      };
    })
    .sort((left, right) => left.source.startAt.getTime() - right.source.startAt.getTime());

  for (const entry of normalized) {
    entriesByDay.get(entry.dateKey)?.push(entry);
  }

  const days = new Map<string, TimesheetDay>(
    dateKeys.map((dateKey) => [
      dateKey,
      buildDay(dateKey, entriesByDay.get(dateKey) ?? [], input.absences, input.now),
    ]),
  );

  // Daily rest: gap between the last entry of a previous day and the first
  // entry of the day, including entries of the day before the computed range.
  normalized.forEach((entry, index) => {
    const previous = normalized[index - 1];
    const day = days.get(entry.dateKey);

    if (!previous || !day || previous.dateKey === entry.dateKey) {
      return;
    }

    const rest = minutesBetween(previous.effectiveEnd, entry.source.startAt);
    if (rest < LABOR_RULES.minimumDailyRestMinutes) {
      day.alerts.push({
        code: 'INSUFFICIENT_DAILY_REST',
        date: entry.dateKey,
        scope: 'DAY',
        value: rest,
        limit: LABOR_RULES.minimumDailyRestMinutes,
      });
    }
  });

  const weeklyWorked = workedMinutesByWeek(normalized, input.timezone);
  const weeks: TimesheetWeek[] = [];
  for (let weekStart = range.from; weekStart <= range.to; weekStart = addDays(weekStart, 7)) {
    const weekDays = eachDateKey(weekStart, addDays(weekStart, 6)).map(
      (dateKey) => days.get(dateKey)!,
    );
    weeks.push(
      buildWeek(
        weekStart,
        weekDays,
        weeklyWorked.get(weekStart) ?? 0,
        contractMinutesAt(contracts, weekStart, input.contractMinutes),
        input,
      ),
    );
  }

  const periodDays = [...days.values()].filter(
    (day) => day.date >= input.from && day.date <= input.to,
  );
  const periodWeeks = weeks.filter(
    (week) => week.weekEnd >= input.from && week.weekStart <= input.to,
  );

  return {
    from: input.from,
    to: input.to,
    timezone: input.timezone,
    contractMinutes: contractMinutesAt(contracts, startOfWeek(input.to), input.contractMinutes),
    days: periodDays,
    weeks: periodWeeks,
    totals: {
      workedMinutes: periodDays.reduce((total, day) => total + day.workedMinutes, 0),
      absenceDays: periodDays.reduce((total, day) => total + absenceTotal(day), 0),
      alertCount:
        periodDays.reduce((total, day) => total + day.alerts.length, 0) +
        periodWeeks.reduce((total, week) => total + week.alerts.length, 0),
    },
  };
}
