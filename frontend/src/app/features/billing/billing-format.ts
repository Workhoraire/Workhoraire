/** "24 €" or "7,50 €": whole euros without decimals, as on the website. */
export function formatEuros(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** "2026-09" -> "septembre 2026" */
export function formatMonth(month: string): string {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${month}-01T00:00:00Z`),
  );
}

/** "1er août 2026": French writes the first day of the month "1er". */
export function formatDeadline(instant: string, timeZone: string): string {
  const text = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(instant));
  return text.replace(/^1(\s)/, '1er$1');
}
