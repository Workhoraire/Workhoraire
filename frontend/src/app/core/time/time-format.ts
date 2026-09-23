/**
 * Date and duration helpers. Days are "YYYY-MM-DD" keys in the company
 * timezone, as returned by the API; instants are ISO strings.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

function parseKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split('-').map(Number);
  return { year, month, day };
}

function keyToUtcDate(dateKey: string): Date {
  const { year, month, day } = parseKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day));
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function utcDateToKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function addDays(dateKey: string, days: number): string {
  return utcDateToKey(new Date(keyToUtcDate(dateKey).getTime() + days * DAY_MS));
}

/** ISO weekday: 1 (Monday) to 7 (Sunday). */
export function isoWeekday(dateKey: string): number {
  const weekday = keyToUtcDate(dateKey).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

export function startOfWeek(dateKey: string): string {
  return addDays(dateKey, 1 - isoWeekday(dateKey));
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function localParts(instant: Date, timeZone: string): Record<string, number> {
  let formatter = partsFormatters.get(timeZone);
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
    partsFormatters.set(timeZone, formatter);
  }

  const values: Record<string, number> = {};
  for (const part of formatter.formatToParts(instant)) {
    if (part.type !== 'literal') {
      values[part.type] = Number(part.value);
    }
  }
  return values;
}

/** Local calendar day of an instant in the company timezone. */
export function toDateKey(instant: Date | string, timeZone: string): string {
  const parts = localParts(new Date(instant), timeZone);
  return `${parts['year']}-${pad(parts['month'])}-${pad(parts['day'])}`;
}

export function todayKey(timeZone: string, now = new Date()): string {
  return toDateKey(now, timeZone);
}

/** "HH:MM" wall-clock time of an instant in the company timezone. */
export function toTimeValue(instant: Date | string, timeZone: string): string {
  const parts = localParts(new Date(instant), timeZone);
  return `${pad(parts['hour'])}:${pad(parts['minute'])}`;
}

function offsetMinutes(instant: Date, timeZone: string): number {
  const parts = localParts(instant, timeZone);
  const asUtc = Date.UTC(
    parts['year'],
    parts['month'] - 1,
    parts['day'],
    parts['hour'],
    parts['minute'],
    parts['second'],
  );
  return Math.round((asUtc - Math.floor(instant.getTime() / 1000) * 1000) / MINUTE_MS);
}

/** ISO instant of a local date and "HH:MM" time in the company timezone. */
export function localDateTimeToIso(dateKey: string, time: string, timeZone: string): string {
  const { year, month, day } = parseKey(dateKey);
  const [hours, minutes] = time.split(':').map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hours, minutes);
  const firstGuess = wallClock - offsetMinutes(new Date(wallClock), timeZone) * MINUTE_MS;
  const offset = offsetMinutes(new Date(firstGuess), timeZone);

  return new Date(wallClock - offset * MINUTE_MS).toISOString();
}

/** "7 h 30", "45 min", "0 h". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;

  if (hours === 0) {
    return rest === 0 ? '0 h' : `${rest} min`;
  }
  return rest === 0 ? `${hours} h` : `${hours} h ${pad(rest)}`;
}

/** Decimal hours with a comma, e.g. 450 -> "7,50". */
export function formatDecimalHours(minutes: number): string {
  return (minutes / 60).toFixed(2).replace('.', ',');
}

export function formatDays(days: number): string {
  const value = String(days).replace('.', ',');
  return `${value} j`;
}

const dayLabel = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const longDate = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const shortDate = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const shortDateYear = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const weekdayShort = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' });

/** "lun. 21 sept." */
export function formatDayLabel(dateKey: string): string {
  return dayLabel.format(keyToUtcDate(dateKey));
}

/** "lundi 21 septembre 2026" */
export function formatLongDate(dateKey: string): string {
  return longDate.format(keyToUtcDate(dateKey));
}

/** "21 sept. 2026" */
export function formatShortDate(dateKey: string): string {
  return shortDateYear.format(keyToUtcDate(dateKey));
}

/** "lun." */
export function formatWeekdayShort(dateKey: string): string {
  return weekdayShort.format(keyToUtcDate(dateKey));
}

/** "21 – 27 sept. 2026" for the week starting on the given Monday. */
export function formatWeekRange(weekStart: string): string {
  const weekEnd = addDays(weekStart, 6);
  return `${shortDate.format(keyToUtcDate(weekStart))} – ${shortDateYear.format(keyToUtcDate(weekEnd))}`;
}

/** "08:30" in the company timezone, or an empty string. */
export function formatTime(instant: string | null, timeZone: string): string {
  return instant ? toTimeValue(instant, timeZone) : '';
}

export function fullName(person: { firstName: string | null; lastName: string | null }): string {
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Sans nom';
}

export function initials(person: { firstName: string | null; lastName: string | null }): string {
  return (
    [person.firstName, person.lastName]
      .filter((value): value is string => Boolean(value))
      .map((value) => value[0])
      .join('')
      .toUpperCase() || '?'
  );
}
