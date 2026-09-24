/** No-break space: between a number and its unit, and before « : ; ! ? » in French text. */
export const NBSP = ' ';

const monthNames = new Intl.DateTimeFormat('fr-FR', { month: 'long', timeZone: 'UTC' });

/** "2026-09-24" -> "24 septembre 2026", "2026-10-01" -> "1er octobre 2026". */
export function formatFrenchDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const monthName = monthNames.format(new Date(Date.UTC(year, month - 1, day)));
  return `${day === 1 ? '1er' : day}${NBSP}${monthName} ${year}`;
}
