/**
 * Prices of docs/produit/08-prix-et-hebergement.md, in euro cents excluding VAT.
 * Découverte is free up to 3 active employees; beyond, Essentiel bills every
 * active employee of the month.
 */
export const FREE_ACTIVE_EMPLOYEES = 3;
export const PRICE_PER_ACTIVE_EMPLOYEE_CENTS = 300;

/** Days to add a payment method once the free plan is exceeded, before read-only mode. */
export const PAYMENT_GRACE_DAYS = 30;

export function monthlyAmountCents(activeEmployees: number): number {
  return activeEmployees <= FREE_ACTIVE_EMPLOYEES
    ? 0
    : activeEmployees * PRICE_PER_ACTIVE_EMPLOYEE_CENTS;
}

/** "2026-09" -> "2026-10" */
export function nextMonthKey(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return monthNumber === 12
    ? `${year + 1}-01`
    : `${year}-${String(monthNumber + 1).padStart(2, '0')}`;
}

/** "2026-01" -> "2025-12" */
export function previousMonthKey(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return monthNumber === 1
    ? `${year - 1}-12`
    : `${year}-${String(monthNumber - 1).padStart(2, '0')}`;
}
