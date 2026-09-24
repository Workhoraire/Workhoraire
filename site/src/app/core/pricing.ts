import { NBSP } from './text';

/**
 * Price grid of WorkHoraire, in euros excluding VAT (HT), as billed by the
 * application (backend/src/billing/pricing.ts): free up to 3 active users,
 * then 3 € for every active user of the month, all of them counted. Once the
 * free plan is exceeded, the company has 30 days to subscribe before the
 * read-only mode.
 *
 * An active user is anyone of the company (employee, manager or owner) with
 * hours in the month, clocked or added to their timesheet, or with an approved
 * absence that falls in the month (backend/src/billing/active-employees.ts).
 */
export const FREE_ACTIVE_EMPLOYEES = 3;
export const PRICE_PER_ACTIVE_EMPLOYEE = 3;
export const PAYMENT_GRACE_DAYS = 30;

const wholeEuros = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const euros = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const counts = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/** "24 €", "2,50 €", "300 000 €" (French separators, no-break spaces). */
export function formatEuros(amount: number): string {
  return Number.isInteger(amount) ? wholeEuros.format(amount) : euros.format(amount);
}

/** "100 000" */
export function formatCount(count: number): string {
  return counts.format(count);
}

/** "0 utilisateur actif", "1 utilisateur actif", "8 utilisateurs actifs". */
export function activeUsers(count: number): string {
  const plural = count > 1 ? 's' : '';
  return `${formatCount(count)}${NBSP}utilisateur${plural} actif${plural}`;
}

const firstPaidTeam = FREE_ACTIVE_EMPLOYEES + 1;

/** The price grid in words, written once for the pages, the calls to action and the page descriptions. */
export const PRICING_TEXT = {
  /** "3 utilisateurs actifs" */
  freeLimit: activeUsers(FREE_ACTIVE_EMPLOYEES),
  /** "3 €" */
  unitPriceEuros: formatEuros(PRICE_PER_ACTIVE_EMPLOYEE),
  /** "3 € HT" */
  unitPrice: `${formatEuros(PRICE_PER_ACTIVE_EMPLOYEE)}${NBSP}HT`,
  /** "30 jours" */
  gracePeriod: `${PAYMENT_GRACE_DAYS}${NBSP}jours`,
  /** "4 utilisateurs actifs", the smallest paying team… */
  firstPaidTeam: activeUsers(firstPaidTeam),
  /** …and its monthly price, "12 € HT": every active user is counted. */
  firstPaidPrice: `${formatEuros(firstPaidTeam * PRICE_PER_ACTIVE_EMPLOYEE)}${NBSP}HT`,
} as const;
