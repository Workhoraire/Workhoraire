/**
 * Calendar helpers working on local dates ("YYYY-MM-DD" keys) in a company
 * timezone. Instants are always JavaScript Dates (UTC); only these helpers
 * convert between instants and the local calendar, using the ICU data shipped
 * with Node.js instead of an external dependency.
 */

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatters.set(timeZone, formatter);
  }

  return formatter;
}

interface LocalParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function localParts(instant: Date, timeZone: string): LocalParts {
  const values: Record<string, number> = {};

  for (const part of formatterFor(timeZone).formatToParts(instant)) {
    if (part.type !== 'literal') {
      values[part.type] = Number(part.value);
    }
  }

  return {
    year: values['year'],
    month: values['month'],
    day: values['day'],
    hour: values['hour'],
    minute: values['minute'],
    second: values['second'],
  };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function isValidDateKey(value: string): boolean {
  const match = DATE_KEY_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  if (!isValidDateKey(dateKey)) {
    throw new RangeError(`Invalid date key: ${dateKey}`);
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  return { year, month, day };
}

/** Offset of the timezone at this instant, in minutes (Paris in summer: 120). */
export function timeZoneOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = localParts(instant, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return Math.round((asUtc - Math.floor(instant.getTime() / 1000) * 1000) / MINUTE_MS);
}

/** Local calendar date of an instant, e.g. "2026-09-23". */
export function toDateKey(instant: Date, timeZone: string): string {
  const parts = localParts(instant, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** Minutes elapsed since local midnight, e.g. 510 for 08:30. */
export function localMinutesOfDay(instant: Date, timeZone: string): number {
  const parts = localParts(instant, timeZone);
  return parts.hour * 60 + parts.minute;
}

/** Instant of the local midnight that starts this calendar date. */
export function startOfLocalDay(dateKey: string, timeZone: string): Date {
  const { year, month, day } = parseDateKey(dateKey);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const firstGuess = utcMidnight - timeZoneOffsetMinutes(new Date(utcMidnight), timeZone) * MINUTE_MS;
  const offset = timeZoneOffsetMinutes(new Date(firstGuess), timeZone);

  return new Date(utcMidnight - offset * MINUTE_MS);
}

/** Instant of a local wall-clock time on a calendar date, e.g. 08:30. */
export function localDateTimeToInstant(
  dateKey: string,
  minutesOfDay: number,
  timeZone: string,
): Date {
  const { year, month, day } = parseDateKey(dateKey);
  const wallClock = Date.UTC(year, month - 1, day) + minutesOfDay * MINUTE_MS;
  const firstGuess = wallClock - timeZoneOffsetMinutes(new Date(wallClock), timeZone) * MINUTE_MS;
  const offset = timeZoneOffsetMinutes(new Date(firstGuess), timeZone);

  return new Date(wallClock - offset * MINUTE_MS);
}

export function addDays(dateKey: string, days: number): string {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day) + days * DAY_MS);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Number of calendar days from one date to another (0 for the same day). */
export function daysBetween(from: string, to: string): number {
  const start = parseDateKey(from);
  const end = parseDateKey(to);

  return Math.round(
    (Date.UTC(end.year, end.month - 1, end.day) -
      Date.UTC(start.year, start.month - 1, start.day)) /
      DAY_MS,
  );
}

/** ISO weekday: 1 for Monday … 7 for Sunday. */
export function isoWeekday(dateKey: string): number {
  const { year, month, day } = parseDateKey(dateKey);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return weekday === 0 ? 7 : weekday;
}

/** Monday of the civil week containing this date. */
export function startOfWeek(dateKey: string): string {
  return addDays(dateKey, 1 - isoWeekday(dateKey));
}

/** Every date from `from` to `to`, both included. */
export function eachDateKey(from: string, to: string): string[] {
  const count = daysBetween(from, to);
  const keys: string[] = [];

  for (let offset = 0; offset <= count; offset += 1) {
    keys.push(addDays(from, offset));
  }

  return keys;
}

/** A @db.Date column value (midnight UTC) converted to a date key. */
export function dateColumnToKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** A date key converted to the value expected by a @db.Date column. */
export function dateKeyToDateColumn(dateKey: string): Date {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day));
}
