import { TimesheetEntry } from '../../core/time/time.models';
import { entryChanges, formInstants } from './entry-changes';

const TZ = 'Europe/Paris';

function entry(overrides: Partial<TimesheetEntry> = {}): TimesheetEntry {
  return {
    id: 'entry-1',
    // Clocked at 08:03:27 and 12:00 in Paris.
    startAt: '2026-09-21T06:03:27.000Z',
    endAt: '2026-09-21T10:00:00.000Z',
    durationMinutes: 236,
    source: 'CLOCK',
    note: null,
    isOpen: false,
    isCorrected: false,
    ...overrides,
  };
}

describe('entry dialog changes', () => {
  it('sends only the note when only the note changed, keeping the clocked seconds', () => {
    expect(
      entryChanges('2026-09-21', entry(), { start: '08:03', end: '12:00', note: ' Réunion ' }, TZ),
    ).toEqual({ note: 'Réunion' });
  });

  it('sends a time only when it changed', () => {
    expect(
      entryChanges('2026-09-21', entry(), { start: '08:03', end: '12:30', note: '' }, TZ),
    ).toEqual({ endAt: '2026-09-21T10:30:00.000Z' });
    expect(
      entryChanges('2026-09-21', entry(), { start: '08:03', end: '12:00', note: '' }, TZ),
    ).toEqual({});
  });

  it('clears a note with an empty string', () => {
    expect(
      entryChanges(
        '2026-09-21',
        entry({ note: 'Ancienne note' }),
        { start: '08:03', end: '12:00', note: '' },
        TZ,
      ),
    ).toEqual({ note: '' });
  });

  it('ends a night shift on the next day and can close an open entry', () => {
    expect(formInstants('2026-09-21', { start: '22:00', end: '06:00' }, TZ)).toEqual({
      startAt: '2026-09-21T20:00:00.000Z',
      endAt: '2026-09-22T04:00:00.000Z',
    });

    const open = entry({ endAt: null, isOpen: true });
    expect(
      entryChanges('2026-09-21', open, { start: '08:03', end: '17:00', note: '' }, TZ),
    ).toEqual({ endAt: '2026-09-21T15:00:00.000Z' });
  });
});
