import { SubscriptionStatus } from '@prisma/client';
import { toSubscriptionStatus } from './billing.service';
import { monthlyAmountCents, nextMonthKey, previousMonthKey } from './pricing';

describe('Pricing', () => {
  it('is free up to 3 active employees, then 3 € HT for each of them', () => {
    expect(monthlyAmountCents(0)).toBe(0);
    expect(monthlyAmountCents(3)).toBe(0);
    expect(monthlyAmountCents(4)).toBe(1200);
    expect(monthlyAmountCents(12)).toBe(3600);
  });

  it('moves between months across the new year', () => {
    expect(nextMonthKey('2026-09')).toBe('2026-10');
    expect(nextMonthKey('2026-12')).toBe('2027-01');
    expect(previousMonthKey('2026-10')).toBe('2026-09');
    expect(previousMonthKey('2027-01')).toBe('2026-12');
  });

  it('maps Stripe subscription statuses', () => {
    expect(toSubscriptionStatus('active')).toBe(SubscriptionStatus.ACTIVE);
    expect(toSubscriptionStatus('trialing')).toBe(SubscriptionStatus.ACTIVE);
    expect(toSubscriptionStatus('past_due')).toBe(SubscriptionStatus.PAST_DUE);
    expect(toSubscriptionStatus('unpaid')).toBe(SubscriptionStatus.PAST_DUE);
    expect(toSubscriptionStatus('incomplete')).toBe(SubscriptionStatus.PAST_DUE);
    expect(toSubscriptionStatus('canceled')).toBe(SubscriptionStatus.CANCELED);
    expect(toSubscriptionStatus('incomplete_expired')).toBe(SubscriptionStatus.CANCELED);
  });
});
