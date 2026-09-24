import { AbsenceType, TimeEntrySource } from '@prisma/client';
import {
  CalculatorAbsence,
  CalculatorEntry,
  calculateTimesheet,
  countAbsenceDays,
} from './timesheet.calculator';

const PARIS = 'Europe/Paris';
const FULL_TIME = 35 * 60;

let sequence = 0;

/** Entry from local Paris wall-clock times (September 2026 is UTC+2). */
function entry(date: string, start: string, end: string | null): CalculatorEntry {
  sequence += 1;
  return {
    id: `entry-${sequence}`,
    startAt: new Date(`${date}T${start}:00+02:00`),
    endAt: end ? new Date(`${end.includes('T') ? end : `${date}T${end}`}:00+02:00`) : null,
    source: TimeEntrySource.CLOCK,
    note: null,
    isCorrected: false,
  };
}

/** A standard day: 08:00-12:00 then 13:00-17:00 (8 hours, 1 hour break). */
function standardDay(date: string): CalculatorEntry[] {
  return [entry(date, '08:00', '12:00'), entry(date, '13:00', '17:00')];
}

function week(from = '2026-09-21', to = '2026-09-27') {
  return { from, to, timezone: PARIS, now: new Date('2026-10-05T10:00:00Z') };
}

describe('calculateTimesheet', () => {
  it('computes daily worked time, breaks and a normal week without overtime', () => {
    const entries = ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24'].flatMap(standardDay);
    entries.push(entry('2026-09-25', '08:00', '11:00'));

    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries,
      absences: [],
    });

    const monday = timesheet.days[0];
    expect(timesheet.days).toHaveLength(7);
    expect(monday).toMatchObject({
      date: '2026-09-21',
      weekday: 1,
      workedMinutes: 480,
      breakMinutes: 60,
      alerts: [],
    });
    expect(monday.firstStartAt).toBe('2026-09-21T06:00:00.000Z');
    expect(monday.lastEndAt).toBe('2026-09-21T15:00:00.000Z');
    expect(timesheet.weeks).toHaveLength(1);
    expect(timesheet.weeks[0]).toMatchObject({
      workedMinutes: 35 * 60,
      workingDays: 5,
      overtime: { tier25Minutes: 0, tier50Minutes: 0 },
      withinPeriod: true,
    });
    expect(timesheet.totals).toEqual({ workedMinutes: 35 * 60, absenceDays: 0, alertCount: 0 });
  });

  it('splits overtime beyond 35 hours into the +25 % and +50 % tiers', () => {
    // 5 days of 9h30 = 47h30: 12h30 of overtime, 8h at +25 % and 4h30 at +50 %.
    const entries = ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].flatMap(
      (date) => [entry(date, '07:30', '12:00'), entry(date, '12:30', '17:30')],
    );

    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: 39 * 60,
      entries,
      absences: [],
    });

    expect(timesheet.weeks[0].workedMinutes).toBe(47 * 60 + 30);
    expect(timesheet.weeks[0].overtime).toEqual({ tier25Minutes: 480, tier50Minutes: 270 });
    expect(timesheet.weeks[0].complementary).toEqual({ tier10Minutes: 0, tier25Minutes: 0 });
    expect(timesheet.weeks[0].alerts).toEqual([]);
  });

  it('counts paid leave toward the overtime threshold (Cass. soc. 10 sept. 2025)', () => {
    // 39 h contract: Monday on paid leave, then 4 days of 7h48 = 31h12 worked.
    // With the leave day valued at 39 h / 5 = 7h48, the week reaches 39 h: 4 h of overtime.
    const entries = ['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].flatMap((date) => [
      entry(date, '08:00', '12:00'),
      entry(date, '13:00', '16:48'),
    ]);
    const paidLeave: CalculatorAbsence = {
      id: 'cp',
      type: AbsenceType.PAID_LEAVE,
      startDate: '2026-09-21',
      endDate: '2026-09-21',
      startsAfternoon: false,
      endsMorning: false,
    };

    const withLeave = calculateTimesheet({
      ...week(),
      contractMinutes: 39 * 60,
      entries,
      absences: [paidLeave],
    });

    expect(withLeave.weeks[0].workedMinutes).toBe(4 * 468);
    expect(withLeave.weeks[0].paidLeaveCreditMinutes).toBe(468);
    expect(withLeave.weeks[0].overtime).toEqual({ tier25Minutes: 240, tier50Minutes: 0 });

    // Sick leave is not assimilated: no overtime on 31h12 of work.
    const withSickLeave = calculateTimesheet({
      ...week(),
      contractMinutes: 39 * 60,
      entries,
      absences: [{ ...paidLeave, type: AbsenceType.SICK_LEAVE }],
    });
    expect(withSickLeave.weeks[0].overtime).toEqual({ tier25Minutes: 0, tier50Minutes: 0 });
  });

  it('does not credit a day of leave that was actually worked, and flags it', () => {
    // Paid leave Monday to Friday accepted, but the employee came back on Thursday.
    const absences: CalculatorAbsence[] = [
      {
        id: 'cp',
        type: AbsenceType.PAID_LEAVE,
        startDate: '2026-09-21',
        endDate: '2026-09-25',
        startsAfternoon: false,
        endsMorning: false,
      },
    ];
    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries: [...standardDay('2026-09-24'), ...standardDay('2026-09-25')].map((item) => ({
        ...item,
        endAt: new Date(item.endAt!.getTime() - 30 * 60_000),
      })),
      absences,
    });

    // 2 x 7 h worked; only the 3 days really off are credited (3 x 7 h).
    expect(timesheet.weeks[0].workedMinutes).toBe(14 * 60);
    expect(timesheet.weeks[0].paidLeaveCreditMinutes).toBe(3 * 7 * 60);
    expect(timesheet.weeks[0].overtime).toEqual({ tier25Minutes: 0, tier50Minutes: 0 });
    expect(timesheet.days[3].alerts.map((alert) => alert.code)).toEqual(['WORK_DURING_ABSENCE']);
    expect(timesheet.days[0].alerts).toEqual([]);
  });

  it('splits a night shift from Sunday to Monday between the two civil weeks', () => {
    const timesheet = calculateTimesheet({
      ...week('2026-09-21', '2026-09-27'),
      contractMinutes: FULL_TIME,
      entries: [
        // Sunday 20 September 22:00 to Monday 21 September 06:00.
        entry('2026-09-20', '22:00', '2026-09-21T06:00'),
        ...['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26'].flatMap((date) => [
          entry(date, '08:00', '12:00'),
          entry(date, '13:00', '16:00'),
        ]),
      ],
      absences: [],
    });

    // 6 h after Monday 0:00 + 5 x 7 h = 41 h in the week of Monday 21: 6 h of overtime.
    expect(timesheet.weeks[0].workedMinutes).toBe(41 * 60);
    expect(timesheet.weeks[0].overtime).toEqual({ tier25Minutes: 360, tier50Minutes: 0 });
    // The shift itself is displayed on the Sunday it started, outside this week.
    expect(timesheet.days[0].workedMinutes).toBe(0);
  });

  it('uses the contract in force each week', () => {
    const timesheet = calculateTimesheet({
      ...week('2026-09-21', '2026-10-04'),
      contractMinutes: 28 * 60,
      contracts: [
        { from: '2000-01-03', minutes: 35 * 60 },
        { from: '2026-09-28', minutes: 28 * 60 },
      ],
      entries: [
        ...['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].flatMap((date) => [
          entry(date, '08:00', '12:00'),
          entry(date, '13:00', '16:00'),
        ]),
        ...['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01'].flatMap((date) => [
          entry(date, '08:00', '12:00'),
          entry(date, '13:00', '16:00'),
        ]),
      ],
      absences: [],
    });

    // Week 1 under the former 35 h contract: nothing extra. Week 2 under 28 h: exactly the contract.
    expect(timesheet.weeks.map((item) => item.contractMinutes)).toEqual([2100, 1680]);
    expect(timesheet.weeks[0].complementary).toEqual({ tier10Minutes: 0, tier25Minutes: 0 });
    expect(timesheet.weeks[0].overtime).toEqual({ tier25Minutes: 0, tier50Minutes: 0 });
    expect(timesheet.weeks[1].complementary).toEqual({ tier10Minutes: 0, tier25Minutes: 0 });
    expect(timesheet.contractMinutes).toBe(1680);
  });

  it('computes complementary hours for part-time employees and flags the 1/10 limit', () => {
    // 24 h contract: 1/10 = 2h24. Worked 28 h = 4 h of complementary hours.
    const entries = ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24'].map((date) =>
      entry(date, '09:00', '16:00'),
    );

    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: 24 * 60,
      entries,
      absences: [],
    });

    expect(timesheet.weeks[0].complementary).toEqual({ tier10Minutes: 144, tier25Minutes: 96 });
    expect(timesheet.weeks[0].overtime).toEqual({ tier25Minutes: 0, tier50Minutes: 0 });
    expect(timesheet.weeks[0].alerts).toEqual([
      expect.objectContaining({ code: 'COMPLEMENTARY_HOURS_LIMIT', value: 240, limit: 144 }),
    ]);
  });

  it('raises daily alerts for the 10-hour maximum and the missing 20-minute break', () => {
    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries: [
        // 11 hours with a 10-minute break only.
        entry('2026-09-21', '07:00', '12:00'),
        entry('2026-09-21', '12:10', '18:10'),
      ],
      absences: [],
    });

    const codes = timesheet.days[0].alerts.map((alert) => alert.code);
    expect(codes).toEqual(['DAILY_MAX_EXCEEDED', 'MISSING_BREAK']);
    expect(timesheet.days[0].alerts[1]).toMatchObject({ value: 10, limit: 20 });
  });

  it('flags a daily rest shorter than 11 hours, including after a night shift', () => {
    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries: [
        // Evening shift ending at 01:00 on Tuesday, attributed to Monday.
        entry('2026-09-21', '17:00', '2026-09-22T01:00'),
        // Restart at 09:00 on Tuesday: only 8 hours of rest.
        entry('2026-09-22', '09:00', '12:00'),
      ],
      absences: [],
    });

    expect(timesheet.days[0].workedMinutes).toBe(8 * 60);
    expect(timesheet.days[1].alerts).toEqual([
      expect.objectContaining({ code: 'INSUFFICIENT_DAILY_REST', value: 480, limit: 660 }),
    ]);
  });

  it('checks the daily rest against the day before the computed weeks', () => {
    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries: [entry('2026-09-20', '14:00', '23:00'), entry('2026-09-21', '06:00', '11:00')],
      absences: [],
    });

    expect(timesheet.days[0].alerts.map((alert) => alert.code)).toEqual([
      'INSUFFICIENT_DAILY_REST',
    ]);
    expect(timesheet.days.map((day) => day.date)).not.toContain('2026-09-20');
  });

  it('raises weekly alerts above 48 hours and for a seventh working day', () => {
    const dates = [
      '2026-09-21',
      '2026-09-22',
      '2026-09-23',
      '2026-09-24',
      '2026-09-25',
      '2026-09-26',
      '2026-09-27',
    ];
    const entries = dates.flatMap((date) => [
      entry(date, '08:00', '12:00'),
      entry(date, '12:30', '16:00'),
    ]);

    const timesheet = calculateTimesheet({
      ...week(),
      contractMinutes: FULL_TIME,
      entries,
      absences: [],
    });

    expect(timesheet.weeks[0].workedMinutes).toBe(7 * 450);
    expect(timesheet.weeks[0].alerts.map((alert) => alert.code)).toEqual([
      'WEEKLY_MAX_EXCEEDED',
      'TOO_MANY_WORKING_DAYS',
    ]);
  });

  it('counts an open entry until now and flags a forgotten clock-out after 12 hours', () => {
    const running = calculateTimesheet({
      from: '2026-09-23',
      to: '2026-09-23',
      timezone: PARIS,
      now: new Date('2026-09-23T09:45:00+02:00'),
      contractMinutes: FULL_TIME,
      entries: [entry('2026-09-23', '08:00', null)],
      absences: [],
    });

    expect(running.days).toHaveLength(1);
    expect(running.days[0].workedMinutes).toBe(105);
    expect(running.days[0].entries[0]).toMatchObject({ isOpen: true, endAt: null });
    expect(running.days[0].alerts).toEqual([]);

    const forgotten = calculateTimesheet({
      from: '2026-09-23',
      to: '2026-09-23',
      timezone: PARIS,
      now: new Date('2026-09-24T08:00:00+02:00'),
      contractMinutes: FULL_TIME,
      entries: [entry('2026-09-23', '08:00', null)],
      absences: [],
    });

    // A forgotten entry counts no hours (they are unknown) and raises only its own alert.
    expect(forgotten.days[0].workedMinutes).toBe(0);
    expect(forgotten.days[0].alerts.map((alert) => alert.code)).toEqual(['OPEN_ENTRY_TOO_LONG']);
    expect(forgotten.days[0].alerts[0]).toMatchObject({ value: 1440, limit: 720 });
  });

  it('attributes entries to the local day of the company timezone', () => {
    const timesheet = calculateTimesheet({
      ...week('2026-09-22', '2026-09-22'),
      contractMinutes: FULL_TIME,
      // 23:30 UTC on Monday is 01:30 on Tuesday in Paris.
      entries: [
        {
          id: 'late',
          startAt: new Date('2026-09-21T23:30:00Z'),
          endAt: new Date('2026-09-22T01:30:00Z'),
          source: TimeEntrySource.MANUAL,
          note: 'Inventaire',
          isCorrected: true,
        },
      ],
      absences: [],
    });

    expect(timesheet.days[0]).toMatchObject({ date: '2026-09-22', workedMinutes: 120 });
    expect(timesheet.days[0].entries[0]).toMatchObject({
      source: TimeEntrySource.MANUAL,
      isCorrected: true,
      note: 'Inventaire',
    });
  });

  it('marks public holidays and counts absences in working days only', () => {
    const absence: CalculatorAbsence = {
      id: 'absence-1',
      type: AbsenceType.PAID_LEAVE,
      // Friday 13 November afternoon to Tuesday 17 November morning 2026.
      startDate: '2026-11-13',
      endDate: '2026-11-17',
      startsAfternoon: true,
      endsMorning: true,
    };

    const timesheet = calculateTimesheet({
      ...week('2026-11-09', '2026-11-15'),
      contractMinutes: FULL_TIME,
      entries: [],
      absences: [absence],
    });

    const wednesday = timesheet.days.find((day) => day.date === '2026-11-11');
    const friday = timesheet.days.find((day) => day.date === '2026-11-13');
    const saturday = timesheet.days.find((day) => day.date === '2026-11-14');

    expect(wednesday?.publicHoliday).toBe('Armistice 1918');
    expect(friday?.absences).toEqual([{ id: 'absence-1', type: AbsenceType.PAID_LEAVE, portion: 0.5 }]);
    expect(saturday?.absences).toEqual([]);
    expect(timesheet.totals.absenceDays).toBe(0.5);
    // Friday afternoon, Monday, Tuesday morning.
    expect(countAbsenceDays(absence)).toBe(2);
  });

  it('computes complete civil weeks when the period starts mid-week', () => {
    const timesheet = calculateTimesheet({
      ...week('2026-09-23', '2026-09-29'),
      contractMinutes: FULL_TIME,
      entries: standardDay('2026-09-21'),
      absences: [],
    });

    expect(timesheet.days.map((day) => day.date)).toEqual([
      '2026-09-23',
      '2026-09-24',
      '2026-09-25',
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
    ]);
    expect(timesheet.weeks.map((item) => [item.weekStart, item.withinPeriod])).toEqual([
      ['2026-09-21', false],
      ['2026-09-28', false],
    ]);
    // Monday's hours belong to the first week even though Monday is outside the period.
    expect(timesheet.weeks[0].workedMinutes).toBe(480);
    expect(timesheet.totals.workedMinutes).toBe(0);
  });

  it('counts real time across the autumn clock change and cuts the week at local midnight', () => {
    // Summer time ends on Sunday 25 October 2026: 03:00 (UTC+2) becomes 02:00 (UTC+1).
    const shift = (id: string, startAt: string, endAt: string): CalculatorEntry => ({
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      source: TimeEntrySource.CLOCK,
      note: null,
      isCorrected: false,
    });
    const timesheet = calculateTimesheet({
      from: '2026-10-19',
      to: '2026-11-01',
      timezone: PARIS,
      now: new Date('2026-11-02T10:00:00Z'),
      contractMinutes: FULL_TIME,
      entries: [
        // Sunday 01:00 (summer time) to 06:00 (winter time): 6 real hours, 5 on the clock face.
        shift('night', '2026-10-25T01:00:00+02:00', '2026-10-25T06:00:00+01:00'),
        // Sunday 22:00 to Monday 03:00 (winter time): 2 hours in each week, then 3.
        shift('late', '2026-10-25T22:00:00+01:00', '2026-10-26T03:00:00+01:00'),
      ],
      absences: [],
    });

    const sunday = timesheet.days.find((day) => day.date === '2026-10-25')!;
    expect(sunday.workedMinutes).toBe(6 * 60 + 5 * 60);
    expect(timesheet.weeks.map((item) => [item.weekStart, item.workedMinutes])).toEqual([
      ['2026-10-19', 6 * 60 + 2 * 60],
      ['2026-10-26', 3 * 60],
    ]);
    // 11 real hours on the Sunday; the 16-hour gap between the shifts is a break.
    expect(sunday.alerts.map((alert) => alert.code)).toEqual(['DAILY_MAX_EXCEEDED']);
  });

  it('counts real time across the spring clock change', () => {
    // Summer time starts on Sunday 29 March 2026: 02:00 (UTC+1) becomes 03:00 (UTC+2).
    const timesheet = calculateTimesheet({
      from: '2026-03-23',
      to: '2026-03-29',
      timezone: PARIS,
      now: new Date('2026-04-01T10:00:00Z'),
      contractMinutes: FULL_TIME,
      entries: [
        {
          id: 'night',
          // 01:00 (winter time) to 05:00 (summer time): 3 real hours, 4 on the clock face.
          startAt: new Date('2026-03-29T01:00:00+01:00'),
          endAt: new Date('2026-03-29T05:00:00+02:00'),
          source: TimeEntrySource.CLOCK,
          note: null,
          isCorrected: false,
        },
      ],
      absences: [],
    });

    expect(timesheet.days.find((day) => day.date === '2026-03-29')!.workedMinutes).toBe(3 * 60);
    expect(timesheet.weeks[0].workedMinutes).toBe(3 * 60);
  });
});
