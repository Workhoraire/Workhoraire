import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingUsage, PlanCode, Subscription, SubscriptionStatus } from '@prisma/client';
import Stripe from 'stripe';
import { MailService } from '../notifications/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from './billing.service';

interface FakeCompany {
  id: string;
  name: string;
  timezone: string;
}

type Where = Record<string, unknown>;

/** Keeps the rows touched by the daily job, and answers its queries like PostgreSQL would. */
function fakeDatabase(companies: FakeCompany[]) {
  const subscriptions = new Map<string, Subscription>();
  const usages = new Map<string, BillingUsage>();
  const entries: Array<{ companyId: string; userId: string; startAt: Date }> = [];
  const usageKey = (companyId: string, month: Date) => `${companyId}|${month.toISOString()}`;
  const matches = (row: Record<string, unknown>, where: Where) =>
    Object.entries(where).every(([field, value]) =>
      value instanceof Date
        ? (row[field] as Date | null)?.getTime() === value.getTime()
        : row[field] === value,
    );

  const prisma = {
    processedWebhook: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
    termsAcceptanceArchive: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
    company: { findMany: jest.fn(async () => companies) },
    user: {
      findMany: jest.fn(async ({ where }: { where: { companyId: string } }) => [
        { email: `admin@${where.companyId}.example`, firstName: 'Alice' },
      ]),
    },
    timeEntry: {
      findMany: jest.fn(
        async ({ where }: { where: { companyId: string; startAt: { gte: Date; lt: Date } } }) => [
          ...new Set(
            entries
              .filter(
                (entry) =>
                  entry.companyId === where.companyId &&
                  entry.startAt >= where.startAt.gte &&
                  entry.startAt < where.startAt.lt,
              )
              .map((entry) => entry.userId),
          ),
        ].map((userId) => ({ userId })),
      ),
    },
    absenceRequest: { findMany: jest.fn().mockResolvedValue([]) },
    subscription: {
      upsert: jest.fn(async ({ where }: { where: { companyId: string } }) => {
        if (!subscriptions.has(where.companyId)) {
          subscriptions.set(where.companyId, {
            id: `subscription-${where.companyId}`,
            companyId: where.companyId,
            plan: PlanCode.DECOUVERTE,
            status: SubscriptionStatus.NONE,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            subscribedAt: null,
            paymentRequiredSince: null,
            paymentWarningSentAt: null,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
            updatedAt: new Date('2026-01-01T00:00:00.000Z'),
          });
        }
        return { ...subscriptions.get(where.companyId)! };
      }),
      updateMany: jest.fn(async ({ where, data }: { where: Where; data: Partial<Subscription> }) => {
        const rows = [...subscriptions.values()].filter((row) => matches(row as never, where));
        rows.forEach((row) => Object.assign(row, data));
        return { count: rows.length };
      }),
      update: jest.fn(async ({ where, data }: { where: { companyId: string }; data: Partial<Subscription> }) =>
        ({ ...Object.assign(subscriptions.get(where.companyId)!, data) }),
      ),
      findUniqueOrThrow: jest.fn(async ({ where }: { where: { companyId: string } }) => ({
        ...subscriptions.get(where.companyId)!,
      })),
    },
    billingUsage: {
      findUnique: jest.fn(
        async ({ where }: { where: { companyId_month: { companyId: string; month: Date } } }) =>
          usages.get(usageKey(where.companyId_month.companyId, where.companyId_month.month)) ?? null,
      ),
      upsert: jest.fn(
        async ({
          where,
          create,
          update,
        }: {
          where: { companyId_month: { companyId: string; month: Date } };
          create: { companyId: string; month: Date; activeEmployees: number; amountCents: number };
          update: { activeEmployees: number; amountCents: number };
        }) => {
          const key = usageKey(where.companyId_month.companyId, where.companyId_month.month);
          const existing = usages.get(key);
          if (existing) {
            Object.assign(existing, update);
          } else {
            usages.set(key, { id: `usage-${usages.size + 1}`, reportedAt: null, createdAt: new Date(), ...create });
          }
          return { ...usages.get(key)! };
        },
      ),
      updateMany: jest.fn(async ({ where, data }: { where: Where; data: Partial<BillingUsage> }) => {
        const rows = [...usages.values()].filter((row) => matches(row as never, where));
        rows.forEach((row) => Object.assign(row, data));
        return { count: rows.length };
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<BillingUsage> }) => {
        const row = [...usages.values()].find((usage) => usage.id === where.id)!;
        return { ...Object.assign(row, data) };
      }),
    },
  };

  return {
    prisma,
    subscriptions,
    /** The usage recorded for a company and a month ("YYYY-MM"). */
    usage: (companyId: string, month: string) =>
      usages.get(usageKey(companyId, new Date(`${month}-01T00:00:00.000Z`))),
    clockIn: (companyId: string, userIds: string[], startAt: string) =>
      userIds.forEach((userId) => entries.push({ companyId, userId, startAt: new Date(startAt) })),
    /** A subscription paid since January 2026, unless told otherwise. */
    subscribe: (companyId: string, status: SubscriptionStatus, overrides: Partial<Subscription> = {}) =>
      subscriptions.set(companyId, {
        id: `subscription-${companyId}`,
        companyId,
        plan: PlanCode.ESSENTIEL,
        status,
        stripeCustomerId: `cus_${companyId}`,
        stripeSubscriptionId: `sub_${companyId}`,
        subscribedAt:
          status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.PAST_DUE
            ? new Date('2026-01-01T00:00:00.000Z')
            : null,
        paymentRequiredSince: null,
        paymentWarningSentAt: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ...overrides,
      }),
  };
}

const STRIPE_SETTINGS: Record<string, string> = {
  STRIPE_SECRET_KEY: 'sk_test_unit',
  STRIPE_PRICE_ID: 'price_unit',
  STRIPE_WEBHOOK_SECRET: 'whsec_unit',
};

function configWith(settings: Record<string, string>): ConfigService {
  return { get: (key: string, fallback?: string) => settings[key] ?? fallback } as unknown as ConfigService;
}

describe('BillingService', () => {
  const paris: FakeCompany = { id: 'paris', name: 'Boulangerie Martin', timezone: 'Europe/Paris' };
  const newYork: FakeCompany = { id: 'new-york', name: 'Bakery Martin', timezone: 'America/New_York' };
  const staff = ['e1', 'e2', 'e3', 'e4', 'e5'];

  let meterEvents: jest.Mock;
  let mail: { send: jest.Mock; enabled: boolean };

  function billingFor(database: ReturnType<typeof fakeDatabase>, settings = STRIPE_SETTINGS) {
    const stripe = { billing: { meterEvents: { create: meterEvents } } } as unknown as Stripe;
    return new BillingService(
      database.prisma as unknown as PrismaService,
      mail as unknown as MailService,
      configWith(settings),
      settings.STRIPE_SECRET_KEY ? stripe : null,
    );
  }

  beforeEach(() => {
    meterEvents = jest.fn().mockResolvedValue({});
    mail = { send: jest.fn().mockResolvedValue(true), enabled: true };
  });

  afterEach(() => jest.restoreAllMocks());

  it('bills each month in the company timezone', async () => {
    const database = fakeDatabase([paris, newYork]);
    // 30 September 22:30 UTC: already 1 October in Paris, still 30 September in New York.
    database.clockIn('paris', staff.slice(0, 4), '2026-09-30T22:30:00.000Z');
    database.clockIn('new-york', staff.slice(0, 4), '2026-09-30T22:30:00.000Z');
    database.subscribe('paris', SubscriptionStatus.ACTIVE);
    database.subscribe('new-york', SubscriptionStatus.ACTIVE);

    await billingFor(database).runDaily(new Date('2026-11-01T12:00:00.000Z'));

    expect(database.usage('paris', '2026-10')).toMatchObject({ activeEmployees: 4, amountCents: 1200 });
    expect(database.usage('paris', '2026-09')).toMatchObject({ activeEmployees: 0, amountCents: 0 });
    expect(database.usage('new-york', '2026-09')).toMatchObject({ activeEmployees: 4, amountCents: 1200 });
    expect(database.usage('new-york', '2026-10')).toMatchObject({ activeEmployees: 0, amountCents: 0 });
    expect(meterEvents).toHaveBeenCalledTimes(2);
    expect(meterEvents).toHaveBeenCalledWith({
      event_name: 'active_employees',
      identifier: `usage-${database.usage('paris', '2026-10')!.id}`,
      payload: { stripe_customer_id: 'cus_paris', value: '4' },
    });
  });

  it('reports usage only while the subscription is paid or its payment is retried', async () => {
    const companies = ['active', 'past-due', 'canceled', 'none'].map((id) => ({
      id,
      name: id,
      timezone: 'Europe/Paris',
    }));
    const database = fakeDatabase(companies);
    for (const company of companies) {
      database.clockIn(company.id, staff, '2026-09-15T08:00:00.000Z');
    }
    database.subscribe('active', SubscriptionStatus.ACTIVE);
    database.subscribe('past-due', SubscriptionStatus.PAST_DUE, { paymentRequiredSince: new Date('2026-09-20') });
    database.subscribe('canceled', SubscriptionStatus.CANCELED, { stripeSubscriptionId: null });
    database.subscribe('none', SubscriptionStatus.NONE, { stripeCustomerId: null });

    await billingFor(database).runDaily(new Date('2026-10-02T04:00:00.000Z'));

    const reported = meterEvents.mock.calls.map(([event]) => event.payload.stripe_customer_id);
    expect(reported.sort()).toEqual(['cus_active', 'cus_past-due']);
    expect(database.usage('canceled', '2026-09')).toMatchObject({ amountCents: 1500, reportedAt: null });
  });

  it('bills the month of the subscription whole, and never a month before it', async () => {
    const database = fakeDatabase([paris]);
    database.clockIn('paris', staff, '2026-10-12T08:00:00.000Z');
    database.clockIn('paris', staff, '2026-11-03T08:00:00.000Z');
    // On the free offer in October, grace period included; subscribed on 10 November.
    database.subscribe('paris', SubscriptionStatus.ACTIVE, { subscribedAt: new Date('2026-11-10T09:00:00.000Z') });
    const billing = billingFor(database);

    await billing.runDaily(new Date('2026-11-11T04:00:00.000Z'));
    expect(database.usage('paris', '2026-10')).toMatchObject({ activeEmployees: 5, reportedAt: null });
    expect(meterEvents).not.toHaveBeenCalled();

    await billing.runDaily(new Date('2026-12-01T04:00:00.000Z'));
    expect(database.usage('paris', '2026-11')).toMatchObject({ activeEmployees: 5, reportedAt: expect.any(Date) });
    expect(database.usage('paris', '2026-10')).toMatchObject({ reportedAt: null });
    expect(meterEvents).toHaveBeenCalledTimes(1);
    expect(meterEvents.mock.calls[0][0].identifier).toBe(`usage-${database.usage('paris', '2026-11')!.id}`);
  });

  it('catches up a month missed since the subscription, within three months', async () => {
    const database = fakeDatabase([paris]);
    for (const day of ['2026-10-12', '2026-11-12', '2026-12-14']) {
      database.clockIn('paris', staff, `${day}T08:00:00.000Z`);
    }
    database.subscribe('paris', SubscriptionStatus.ACTIVE, { subscribedAt: new Date('2026-11-10T09:00:00.000Z') });

    // No run on 1 December (server down): the run of 2 January reports December and November.
    await billingFor(database).runDaily(new Date('2027-01-02T04:00:00.000Z'));

    expect(database.usage('paris', '2026-12')).toMatchObject({ reportedAt: expect.any(Date) });
    expect(database.usage('paris', '2026-11')).toMatchObject({ reportedAt: expect.any(Date) });
    expect(database.usage('paris', '2026-10')).toMatchObject({ activeEmployees: 5, reportedAt: null });
    expect(meterEvents).toHaveBeenCalledTimes(2);

    // Reported once only.
    await billingFor(database).runDaily(new Date('2027-01-03T04:00:00.000Z'));
    expect(meterEvents).toHaveBeenCalledTimes(2);
  });

  it('does not bill the months between a cancellation and a new subscription', async () => {
    const database = fakeDatabase([paris]);
    for (const day of ['2026-08-12', '2026-09-14', '2026-10-12', '2026-11-12']) {
      database.clockIn('paris', staff, `${day}T08:00:00.000Z`);
    }
    const billing = billingFor(database);

    // Subscribed in August, canceled in September, subscribed again on 10 November.
    database.subscribe('paris', SubscriptionStatus.ACTIVE, { subscribedAt: new Date('2026-08-05T09:00:00.000Z') });
    await billing.runDaily(new Date('2026-09-01T04:00:00.000Z'));
    database.subscribe('paris', SubscriptionStatus.CANCELED, { plan: PlanCode.DECOUVERTE, stripeSubscriptionId: null });
    await billing.runDaily(new Date('2026-10-01T04:00:00.000Z'));
    database.subscribe('paris', SubscriptionStatus.ACTIVE, {
      stripeSubscriptionId: 'sub_again',
      subscribedAt: new Date('2026-11-10T09:00:00.000Z'),
    });
    await billing.runDaily(new Date('2026-11-11T04:00:00.000Z'));
    await billing.runDaily(new Date('2026-12-01T04:00:00.000Z'));

    const reported = ['2026-08', '2026-09', '2026-10', '2026-11'].map(
      (month) => database.usage('paris', month)?.reportedAt instanceof Date,
    );
    expect(reported).toEqual([true, false, false, true]);
    expect(meterEvents).toHaveBeenCalledTimes(2);
  });

  it('reports the month again the next day when Stripe fails', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const database = fakeDatabase([paris]);
    database.clockIn('paris', staff, '2026-09-15T08:00:00.000Z');
    database.subscribe('paris', SubscriptionStatus.ACTIVE);
    meterEvents.mockRejectedValueOnce(new Error('Stripe is unavailable'));

    await billingFor(database).runDaily(new Date('2026-10-01T04:00:00.000Z'));
    expect(database.usage('paris', '2026-09')).toMatchObject({ reportedAt: null });

    await billingFor(database).runDaily(new Date('2026-10-02T04:00:00.000Z'));
    expect(database.usage('paris', '2026-09')).toMatchObject({ reportedAt: expect.any(Date) });
    expect(meterEvents).toHaveBeenCalledTimes(2);
  });

  it('purges handled webhooks after 90 days and closed-company acceptances after 5 years', async () => {
    const database = fakeDatabase([]);

    await billingFor(database).runDaily(new Date('2026-10-01T04:00:00.000Z'));

    expect(database.prisma.processedWebhook.deleteMany).toHaveBeenCalledWith({
      where: { receivedAt: { lt: new Date('2026-07-03T04:00:00.000Z') } },
    });
    expect(database.prisma.termsAcceptanceArchive.deleteMany).toHaveBeenCalledWith({
      where: { closedAt: { lt: new Date('2021-10-01T04:00:00.000Z') } },
    });
  });

  it('starts a new grace period after a cancellation, and warns until the e-mail is delivered', async () => {
    const database = fakeDatabase([paris]);
    database.clockIn('paris', staff, '2026-10-05T08:00:00.000Z');
    database.subscribe('paris', SubscriptionStatus.CANCELED, { plan: PlanCode.DECOUVERTE, stripeSubscriptionId: null });
    // The SMTP server is down on the first day.
    mail.send.mockResolvedValueOnce(false);

    await billingFor(database).runDaily(new Date('2026-10-06T04:00:00.000Z'));
    expect(database.subscriptions.get('paris')).toMatchObject({
      paymentRequiredSince: new Date('2026-10-06T04:00:00.000Z'),
      paymentWarningSentAt: null,
    });

    await billingFor(database).runDaily(new Date('2026-10-07T04:00:00.000Z'));
    expect(database.subscriptions.get('paris')).toMatchObject({
      paymentRequiredSince: new Date('2026-10-06T04:00:00.000Z'),
      paymentWarningSentAt: new Date('2026-10-07T04:00:00.000Z'),
    });
    expect(mail.send).toHaveBeenLastCalledWith(
      'admin@paris.example',
      expect.objectContaining({ subject: 'Offre gratuite dépassée : ajoutez un moyen de paiement' }),
    );
    expect(mail.send.mock.lastCall[1].text).toContain('avant le 5 novembre 2026');

    await billingFor(database).runDaily(new Date('2026-10-08T04:00:00.000Z'));
    expect(mail.send).toHaveBeenCalledTimes(2);
  });

  it('answers a Stripe failure with a plain 503, and keeps its message in the logs', async () => {
    const logged = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const database = fakeDatabase([paris]);
    const stripe = {
      customers: {
        create: jest.fn().mockRejectedValue(
          new Stripe.errors.StripeAuthenticationError({
            message: 'Invalid API Key provided: sk_test_***',
            type: 'authentication_error',
          } as never),
        ),
      },
    } as unknown as Stripe;
    const billing = new BillingService(
      database.prisma as unknown as PrismaService,
      mail as unknown as MailService,
      configWith(STRIPE_SETTINGS),
      stripe,
    );
    const admin = { id: 'alice', companyId: paris.id, email: 'alice@example.com', company: paris };

    await expect(billing.createCheckout(admin as never)).rejects.toThrow(ServiceUnavailableException);
    expect(logged.mock.calls[0][0]).toContain('Invalid API Key');
  });

  it('keeps payments off, with one warning, until the three Stripe settings are set', () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const database = fakeDatabase([]);

    const withoutSecret = billingFor(database, { ...STRIPE_SETTINGS, STRIPE_WEBHOOK_SECRET: '' });
    expect(withoutSecret.paymentsEnabled).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('STRIPE_WEBHOOK_SECRET must all be set');

    expect(billingFor(database, {}).paymentsEnabled).toBe(false);
    expect(billingFor(database).paymentsEnabled).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
