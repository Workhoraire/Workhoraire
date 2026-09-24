import { addDays, localDateTimeToIso } from '../../core/time/time-format';
import { TimesheetEntry } from '../../core/time/time.models';

/** Raw values of the entry dialog: "HH:MM" times on the day of the entry. */
export interface EntryFormValue {
  start: string;
  end: string;
  note: string;
}

export interface EntryChanges {
  startAt?: string;
  endAt?: string;
  note?: string;
}

/**
 * Instants typed in the dialog. An end time earlier than (or equal to) the
 * start time ends on the next day: night shifts are entered on their start day.
 */
export function formInstants(
  date: string,
  value: Pick<EntryFormValue, 'start' | 'end'>,
  timezone: string,
): { startAt: string; endAt?: string } {
  const startAt = localDateTimeToIso(date, value.start, timezone);
  if (!value.end) {
    return { startAt };
  }
  const endDate = value.end <= value.start ? addDays(date, 1) : date;
  return { startAt, endAt: localDateTimeToIso(endDate, value.end, timezone) };
}

function sameMinute(first: string, second: string): boolean {
  return Math.floor(Date.parse(first) / 60_000) === Math.floor(Date.parse(second) / 60_000);
}

/**
 * Only the fields the manager actually changed. Re-sending an untouched time
 * would drop its seconds and record in the audit trail a change nobody made.
 */
export function entryChanges(
  date: string,
  entry: TimesheetEntry,
  value: EntryFormValue,
  timezone: string,
): EntryChanges {
  const { startAt, endAt } = formInstants(date, value, timezone);
  const changes: EntryChanges = {};

  if (!sameMinute(startAt, entry.startAt)) {
    changes.startAt = startAt;
  }
  if (endAt && (!entry.endAt || !sameMinute(endAt, entry.endAt))) {
    changes.endAt = endAt;
  }
  const note = value.note.trim();
  if (note !== (entry.note ?? '')) {
    changes.note = note;
  }
  return changes;
}
