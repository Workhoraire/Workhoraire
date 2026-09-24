import {
  FREE_ACTIVE_EMPLOYEES,
  PAYMENT_GRACE_DAYS,
  PRICE_PER_ACTIVE_EMPLOYEE,
  PRICING_TEXT,
  activeUsers,
  formatCount,
  formatEuros,
} from '../../core/pricing';
import {
  MAX_SIMULATED_EMPLOYEES,
  estimatePrice,
  monthlyPrice,
  normalizeEmployeeCount,
  parseEmployeeCount,
} from './pricing-simulator';

/** Intl uses no-break spaces in French: compare with plain spaces. */
function plain(text: string): string {
  return text.replace(/\s/g, ' ');
}

describe('pricing simulator', () => {
  it('uses the price grid billed by the application (backend/src/billing/pricing.ts)', () => {
    expect(FREE_ACTIVE_EMPLOYEES).toBe(3);
    expect(PRICE_PER_ACTIVE_EMPLOYEE).toBe(3);
    expect(PAYMENT_GRACE_DAYS).toBe(30);
  });

  it('is free up to 3 active users', () => {
    for (const count of [0, 1, 2, 3]) {
      expect(monthlyPrice(count)).withContext(`${count} users`).toBe(0);
    }
  });

  it('charges 3 € per active user and per month beyond 3, all of them counted', () => {
    expect(monthlyPrice(4)).toBe(12);
    expect(monthlyPrice(8)).toBe(24);
    expect(monthlyPrice(999)).toBe(2997);
    expect(monthlyPrice(1000)).toBe(3000);
    expect(monthlyPrice(25_000)).toBe(75_000);
  });

  it('reads the typed value and says when the price uses another number', () => {
    expect(parseEmployeeCount('12')).toEqual({ count: 12, issue: null });
    expect(parseEmployeeCount(' 1500 ')).toEqual({ count: 1500, issue: null });
    expect(parseEmployeeCount('')).toEqual({ count: 0, issue: null });
    expect(parseEmployeeCount('100000000')).toEqual({
      count: MAX_SIMULATED_EMPLOYEES,
      issue: 'tooLarge',
    });
    expect(parseEmployeeCount('7.8')).toEqual({ count: 7, issue: 'decimal' });
    expect(parseEmployeeCount('7,8')).toEqual({ count: 7, issue: 'decimal' });
    expect(parseEmployeeCount('-2')).toEqual({ count: 0, issue: 'negative' });
    expect(parseEmployeeCount('8 p')).toEqual({ count: 0, issue: 'invalid' });
  });

  it('keeps the count whole, positive and bounded', () => {
    expect(normalizeEmployeeCount(-2)).toBe(0);
    expect(normalizeEmployeeCount(Number.NaN)).toBe(0);
    expect(normalizeEmployeeCount(Number.POSITIVE_INFINITY)).toBe(MAX_SIMULATED_EMPLOYEES);
    expect(normalizeEmployeeCount(7.8)).toBe(7);
    expect(monthlyPrice(-10)).toBe(0);
  });

  it('describes the plan and the unit price', () => {
    expect(estimatePrice(2)).toEqual({
      activeEmployees: 2,
      plan: 'decouverte',
      unitPrice: 0,
      monthlyPrice: 0,
    });
    expect(estimatePrice(8)).toEqual({
      activeEmployees: 8,
      plan: 'essentiel',
      unitPrice: 3,
      monthlyPrice: 24,
    });
  });

  it('formats prices and counts the French way', () => {
    expect(plain(formatEuros(0))).toBe('0 €');
    expect(plain(formatEuros(24))).toBe('24 €');
    expect(plain(formatEuros(2.5))).toBe('2,50 €');
    expect(plain(formatEuros(300_000))).toBe('300 000 €');
    expect(plain(formatCount(100_000))).toBe('100 000');
  });

  it('writes 0 and 1 user in the singular, with a no-break space after the number', () => {
    expect(activeUsers(0)).toBe('0 utilisateur actif');
    expect(activeUsers(1)).toBe('1 utilisateur actif');
    expect(activeUsers(8)).toBe('8 utilisateurs actifs');
  });

  it('derives the texts of the price grid from the constants, with no-break spaces', () => {
    expect(PRICING_TEXT.freeLimit).toBe('3 utilisateurs actifs');
    expect(PRICING_TEXT.unitPrice).toBe(`${formatEuros(3)} HT`);
    expect(PRICING_TEXT.unitPrice).not.toMatch(/ /);
    expect(PRICING_TEXT.gracePeriod).toBe('30 jours');
    expect(PRICING_TEXT.firstPaidTeam).toBe('4 utilisateurs actifs');
    expect(PRICING_TEXT.firstPaidPrice).toBe(`${formatEuros(12)} HT`);
  });
});
