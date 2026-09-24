import { FREE_ACTIVE_EMPLOYEES, PRICE_PER_ACTIVE_EMPLOYEE } from '../../core/pricing';

/** Upper bound of the simulator, far beyond the companies WorkHoraire is made for. */
export const MAX_SIMULATED_EMPLOYEES = 100_000;

export type Plan = 'decouverte' | 'essentiel';

export interface PriceEstimate {
  activeEmployees: number;
  plan: Plan;
  /** Price per active user and per month, 0 with the free plan. */
  unitPrice: number;
  /** Monthly price excluding VAT. */
  monthlyPrice: number;
}

/** Why the typed value differs from the number of active users used for the price. */
export type CountIssue = 'invalid' | 'negative' | 'decimal' | 'tooLarge';

export interface EmployeeCount {
  /** Number of active users used for the price. */
  count: number;
  issue: CountIssue | null;
}

/**
 * Reads the simulator field. The price is always computed for a whole number
 * between 0 and MAX_SIMULATED_EMPLOYEES, and `issue` says when that number is
 * not what was typed, so that the page can explain it. An empty field is 0.
 */
export function parseEmployeeCount(text: string): EmployeeCount {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { count: 0, issue: null };
  }
  const value = Number(trimmed.replace(',', '.'));
  if (Number.isNaN(value)) {
    return { count: 0, issue: 'invalid' };
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

/** Whole number of active users within the bounds of the simulator. */
export function normalizeEmployeeCount(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  return Math.min(Math.floor(value), MAX_SIMULATED_EMPLOYEES);
}

/** Monthly price excluding VAT. There is no base fee: every active user is counted. */
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
