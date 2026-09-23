import {
  addDays,
  daysBetween,
  eachDateKey,
  isValidDateKey,
  isValidTimeZone,
  isoWeekday,
  localDateTimeToInstant,
  startOfLocalDay,
  startOfWeek,
  timeZoneOffsetMinutes,
  toDateKey,
} from './local-date';
import { easterSunday, frenchPublicHolidays, publicHolidayName } from './public-holidays';

const PARIS = 'Europe/Paris';

describe('local dates', () => {
  it('converts instants to the local calendar date of the company timezone', () => {
    // 23:30 UTC on 30 September is already 1 October in Paris (UTC+2).
    expect(toDateKey(new Date('2026-09-30T23:30:00Z'), PARIS)).toBe('2026-10-01');
    expect(toDateKey(new Date('2026-09-30T21:59:00Z'), PARIS)).toBe('2026-09-30');
    expect(toDateKey(new Date('2026-09-30T23:30:00Z'), 'America/New_York')).toBe('2026-09-30');
  });

  it('handles daylight saving time transitions', () => {
    expect(timeZoneOffsetMinutes(new Date('2026-01-15T12:00:00Z'), PARIS)).toBe(60);
    expect(timeZoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), PARIS)).toBe(120);

    // Summer time starts on Sunday 29 March 2026 and ends on Sunday 25 October 2026.
    expect(startOfLocalDay('2026-03-29', PARIS).toISOString()).toBe('2026-03-28T23:00:00.000Z');
    expect(startOfLocalDay('2026-03-30', PARIS).toISOString()).toBe('2026-03-29T22:00:00.000Z');
    expect(startOfLocalDay('2026-10-25', PARIS).toISOString()).toBe('2026-10-24T22:00:00.000Z');
    expect(startOfLocalDay('2026-10-26', PARIS).toISOString()).toBe('2026-10-25T23:00:00.000Z');
  });

  it('converts a local wall-clock time to an instant', () => {
    expect(localDateTimeToInstant('2026-09-23', 8 * 60 + 30, PARIS).toISOString()).toBe(
      '2026-09-23T06:30:00.000Z',
    );
    expect(localDateTimeToInstant('2026-12-23', 8 * 60 + 30, PARIS).toISOString()).toBe(
      '2026-12-23T07:30:00.000Z',
    );
  });

  it('does calendar arithmetic on date keys', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(daysBetween('2026-09-01', '2026-09-30')).toBe(29);
    expect(eachDateKey('2026-09-28', '2026-10-01')).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
    ]);
  });

  it('uses civil weeks starting on Monday', () => {
    expect(isoWeekday('2026-09-21')).toBe(1);
    expect(isoWeekday('2026-09-27')).toBe(7);
    expect(startOfWeek('2026-09-23')).toBe('2026-09-21');
    expect(startOfWeek('2026-09-27')).toBe('2026-09-21');
    expect(startOfWeek('2026-09-21')).toBe('2026-09-21');
  });

  it('validates date keys and timezones', () => {
    expect(isValidDateKey('2026-02-29')).toBe(false);
    expect(isValidDateKey('2028-02-29')).toBe(true);
    expect(isValidDateKey('2026-9-1')).toBe(false);
    expect(isValidTimeZone(PARIS)).toBe(true);
    expect(isValidTimeZone('Not/A-Timezone')).toBe(false);
  });
});

describe('French public holidays', () => {
  it('computes Easter Sunday', () => {
    expect(easterSunday(2024)).toBe('2024-03-31');
    expect(easterSunday(2025)).toBe('2025-04-20');
    expect(easterSunday(2026)).toBe('2026-04-05');
    expect(easterSunday(2027)).toBe('2027-03-28');
  });

  it('lists the eleven public holidays of the Code du travail', () => {
    const holidays = frenchPublicHolidays(2026);

    expect(holidays.size).toBe(11);
    expect(holidays.get('2026-04-06')).toBe('Lundi de Pâques');
    expect(holidays.get('2026-05-14')).toBe('Ascension');
    expect(holidays.get('2026-05-25')).toBe('Lundi de Pentecôte');
    expect(publicHolidayName('2026-07-14')).toBe('Fête nationale');
    expect(publicHolidayName('2026-07-15')).toBeNull();
  });
});
