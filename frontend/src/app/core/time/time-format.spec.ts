import { describeAlert } from './labels';
import {
  addDays,
  formatDecimalHours,
  formatDuration,
  formatTime,
  formatWeekRange,
  fullName,
  initials,
  isoWeekday,
  localDateTimeToIso,
  startOfWeek,
  toDateKey,
  toTimeValue,
} from './time-format';

const PARIS = 'Europe/Paris';

describe('time-format', () => {
  it('formats durations the way French users read them', () => {
    expect(formatDuration(0)).toBe('0 h');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(450)).toBe('7 h 30');
    expect(formatDuration(2105)).toBe('35 h 05');
    expect(formatDecimalHours(450)).toBe('7,50');
  });

  it('works with civil weeks starting on Monday', () => {
    expect(isoWeekday('2026-09-21')).toBe(1);
    expect(isoWeekday('2026-09-27')).toBe(7);
    expect(startOfWeek('2026-09-27')).toBe('2026-09-21');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(formatWeekRange('2026-09-21')).toContain('2026');
  });

  it('converts local times of the company timezone to instants, across daylight saving time', () => {
    expect(localDateTimeToIso('2026-09-23', '08:30', PARIS)).toBe('2026-09-23T06:30:00.000Z');
    expect(localDateTimeToIso('2026-12-23', '08:30', PARIS)).toBe('2026-12-23T07:30:00.000Z');
    expect(localDateTimeToIso('2026-10-25', '12:00', PARIS)).toBe('2026-10-25T11:00:00.000Z');
  });

  it('reads instants in the company timezone, not the device timezone', () => {
    expect(toDateKey('2026-09-30T23:30:00Z', PARIS)).toBe('2026-10-01');
    expect(toTimeValue('2026-09-23T06:30:00Z', PARIS)).toBe('08:30');
    expect(formatTime('2026-09-23T06:30:00Z', 'America/New_York')).toBe('02:30');
    expect(formatTime(null, PARIS)).toBe('');
  });

  it('builds names and initials safely', () => {
    expect(fullName({ firstName: 'Emma', lastName: 'Martin' })).toBe('Emma Martin');
    expect(fullName({ firstName: null, lastName: null })).toBe('Sans nom');
    expect(initials({ firstName: 'emma', lastName: 'martin' })).toBe('EM');
  });

  it('explains compliance alerts with their measured value', () => {
    expect(
      describeAlert({ code: 'DAILY_MAX_EXCEEDED', date: '2026-09-21', scope: 'DAY', value: 665, limit: 600 }),
    ).toBe('Plus de 10 h de travail dans la journée : 11 h 05 (max. 10 h)');
    expect(
      describeAlert({ code: 'MISSING_BREAK', date: '2026-09-21', scope: 'DAY', value: 10, limit: 20 }),
    ).toBe('Pause de 20 minutes manquante (plus longue pause : 10 min)');
  });
});
