import {
  MAX_SIMULATED_EMPLOYEES,
  estimatePrice,
  formatCount,
  formatEuros,
  monthlyPrice,
  normalizeEmployeeCount,
  parseEmployeeCount,
} from './pricing-simulator';

/** Intl uses no-break spaces in French: compare with plain spaces. */
function plain(text: string): string {
  return text.replace(/\s/g, ' ');
}

describe('pricing simulator', () => {
  it('is free up to 3 active employees', () => {
    for (const count of [0, 1, 2, 3]) {
      expect(monthlyPrice(count)).withContext(`${count} employees`).toBe(0);
    }
  });

  it('charges 3 € per active employee and per month beyond 3, with no base fee', () => {
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
    expect(parseEmployeeCount('100000000')).toEqual({ count: MAX_SIMULATED_EMPLOYEES, issue: 'tooLarge' });
    expect(parseEmployeeCount('7.8')).toEqual({ count: 7, issue: 'decimal' });
    expect(parseEmployeeCount('7,8')).toEqual({ count: 7, issue: 'decimal' });
    expect(parseEmployeeCount('-2')).toEqual({ count: 0, issue: 'negative' });
  });

  it('keeps the employee count whole, positive and bounded', () => {
    expect(normalizeEmployeeCount(-2)).toBe(0);
    expect(normalizeEmployeeCount(Number.NaN)).toBe(0);
    expect(normalizeEmployeeCount(Number.POSITIVE_INFINITY)).toBe(MAX_SIMULATED_EMPLOYEES);
    expect(normalizeEmployeeCount(7.8)).toBe(7);
    expect(monthlyPrice(-10)).toBe(0);
  });

  it('describes the plan and the unit price', () => {
    expect(estimatePrice(2)).toEqual({ activeEmployees: 2, plan: 'decouverte', unitPrice: 0, monthlyPrice: 0 });
    expect(estimatePrice(8)).toEqual({ activeEmployees: 8, plan: 'essentiel', unitPrice: 3, monthlyPrice: 24 });
  });

  it('formats prices and counts the French way', () => {
    expect(plain(formatEuros(0))).toBe('0 €');
    expect(plain(formatEuros(24))).toBe('24 €');
    expect(plain(formatEuros(2.5))).toBe('2,50 €');
    expect(plain(formatEuros(300_000))).toBe('300 000 €');
    expect(plain(formatCount(100_000))).toBe('100 000');
  });
});
