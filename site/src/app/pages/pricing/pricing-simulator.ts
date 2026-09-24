/**
 * Price grid of WorkHoraire, in euros excluding VAT (HT), as billed by the
 * application: free up to 3 active employees, then 3 € for every active
 * employee of the month. An active employee clocked in, or had an approved
 * absence, during the month.
 */
export const FREE_ACTIVE_EMPLOYEES = 3;
export const PRICE_PER_ACTIVE_EMPLOYEE = 3;
/** Upper bound of the simulator, far beyond the companies WorkHoraire is made for. */
export const MAX_SIMULATED_EMPLOYEES = 100_000;

export type Plan = 'decouverte' | 'essentiel';

export interface PriceEstimate {
  activeEmployees: number;
  plan: Plan;
  /** Price per active employee and per month, 0 with the free plan. */
  unitPrice: number;
  /** Monthly price excluding VAT. */
  monthlyPrice: number;
}

/** Why the typed value differs from the number of employees used for the price. */
export type CountIssue = 'negative' | 'decimal' | 'tooLarge';

export interface EmployeeCount {
  /** Number of active employees used for the price. */
  count: number;
  issue: CountIssue | null;
}

/**
 * Reads the simulator field. The price is always computed for a whole number
 * between 0 and MAX_SIMULATED_EMPLOYEES, and `issue` says when that number is
 * not what was typed, so that the page can explain it.
 */
export function parseEmployeeCount(text: string): EmployeeCount {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { count: 0, issue: null };
  }
  const value = Number(trimmed.replace(',', '.'));
  if (Number.isNaN(value)) {
    return { count: 0, issue: null };
  }
  if (value < 0) {
    return { count: 0, issue: 'negative' };
  }
  if (value > MAX_SIMULATED_EMPLOYEES) {
    return { count: MAX_SIMULATED_EMPLOYEES, issue: 'tooLarge' };
  }
  if (!Number.isInteger(value)) {
    return { count: Math.floor(value), issue: 'decimal' };
  }
  return { count: value, issue: null };
}

/** Whole number of employees within the bounds of the simulator. */
export function normalizeEmployeeCount(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  return Math.min(Math.floor(value), MAX_SIMULATED_EMPLOYEES);
}

/** Monthly price excluding VAT. There is no base fee: every active employee is counted. */
export function monthlyPrice(activeEmployees: number): number {
  const count = normalizeEmployeeCount(activeEmployees);
  return count <= FREE_ACTIVE_EMPLOYEES ? 0 : count * PRICE_PER_ACTIVE_EMPLOYEE;
}

export function estimatePrice(activeEmployees: number): PriceEstimate {
  const count = normalizeEmployeeCount(activeEmployees);
  const free = count <= FREE_ACTIVE_EMPLOYEES;
  return {
    activeEmployees: count,
    plan: free ? 'decouverte' : 'essentiel',
    unitPrice: free ? 0 : PRICE_PER_ACTIVE_EMPLOYEE,
    monthlyPrice: monthlyPrice(count),
  };
}

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
