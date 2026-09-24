/** Dates and times of e-mails, in the company timezone like everywhere else. */

/** French writes the first day of the month "1er": "1er octobre", not "1 octobre". */
function firstOfMonth(text: string): string {
  return text.replace(/(^|\s)1(\s)/, '$11er$2');
}

/** "lundi 21 septembre" */
export function formatMailDay(instant: Date, timeZone: string): string {
  return firstOfMonth(new Intl.DateTimeFormat('fr-FR', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(instant));
}

/** "30 septembre 2026" */
export function formatMailDate(instant: Date, timeZone: string): string {
  return firstOfMonth(new Intl.DateTimeFormat('fr-FR', {
    timeZone,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(instant));
}

function formatTime(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(instant);
}

/** "08:00 – 12:00", or "08:00 – en cours" for an open period. */
export function formatMailPeriod(
  period: { startAt: string; endAt: string | null },
  timeZone: string,
): string {
  const start = formatTime(new Date(period.startAt), timeZone);
  const end = period.endAt ? formatTime(new Date(period.endAt), timeZone) : 'en cours';
  return `${start} – ${end}`;
}

export function mailName(person: { firstName: string | null; lastName: string | null }): string {
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Votre responsable';
}
