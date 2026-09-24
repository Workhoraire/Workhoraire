import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Company,
  PlanCode,
  Prisma,
  Subscription,
  SubscriptionStatus,
  UserRole,
} from '@prisma/client';
import Stripe from 'stripe';
import { ApplicationUser } from '../auth/auth.types';
import { dateKeyToDateColumn, toDateKey } from '../common/dates/local-date';
import { formatMailDate } from '../notifications/mail-format';
import { MailContent, paymentFailedMail, paymentRequiredMail } from '../notifications/mail-templates';
import { MailService } from '../notifications/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { countActiveEmployees } from './active-employees';
import {
  FREE_ACTIVE_EMPLOYEES,
  PAYMENT_GRACE_DAYS,
  PRICE_PER_ACTIVE_EMPLOYEE_CENTS,
  monthlyAmountCents,
  previousMonthKey,
} from './pricing';
import { STRIPE_CLIENT } from './stripe.provider';

const DAY_MS = 24 * 60 * 60 * 1000;

type BilledCompany = Pick<Company, 'id' | 'name' | 'timezone'>;

export interface BillingOverview {
  plan: PlanCode;
  status: SubscriptionStatus;
  /** Current month, "YYYY-MM", in the company timezone. */
  month: string;
  /** Active employees of the current month so far. */
  activeEmployees: number;
  estimatedAmountCents: number;
  lastMonth: { month: string; activeEmployees: number; amountCents: number };
  freeActiveEmployees: number;
  pricePerActiveEmployeeCents: number;
  /** Over the free plan without a working payment: to settle before graceUntil. */
  paymentRequired: boolean;
  graceUntil: string | null;
  readOnly: boolean;
  /** Online payment is configured on this server. */
  paymentsEnabled: boolean;
  /** Invoices and payment method can be managed in the Stripe customer portal. */
  portalAvailable: boolean;
}

/** Stripe subscription status -> WorkHoraire status. */
export function toSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
      return SubscriptionStatus.ACTIVE;
    case 'canceled':
    case 'incomplete_expired':
      return SubscriptionStatus.CANCELED;
    default:
      // past_due, unpaid, incomplete, paused: the payment has to be fixed.
      return SubscriptionStatus.PAST_DUE;
  }
}

/** Stripe fields holding either an ID or the expanded object. */
function stripeId(value: string | { id?: string } | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return typeof value === 'string' ? value : (value.id ?? null);
}

interface SubscriptionChange {
  customerId: string;
  subscriptionId: string;
  status: SubscriptionStatus;
}

/**
 * Billing of the companies (docs/produit/08-prix-et-hebergement.md):
 * Découverte is free up to 3 active employees in the month; beyond, Essentiel
 * bills 3 € HT per active employee, through Stripe. A company over the free
 * plan without a working payment has 30 days to settle, then WorkHoraire
 * becomes read-only for it (clocking and paying stay possible).
 *
 * Without STRIPE_SECRET_KEY and STRIPE_PRICE_ID, payments are disabled: the
 * page shows the usage, and no company is ever asked to pay or made read-only.
 */
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly priceId: string;
  private readonly taxRateId: string;
  private readonly webhookSecret: string;
  private readonly meterEvent: string;
  private readonly appUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    config: ConfigService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe | null,
  ) {
    this.priceId = config.get<string>('STRIPE_PRICE_ID', '');
    this.taxRateId = config.get<string>('STRIPE_TAX_RATE_ID', '');
    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET', '');
    this.meterEvent = config.get<string>('STRIPE_METER_EVENT', '') || 'active_employees';
    this.appUrl = config.get<string>('FRONTEND_URL', 'http://localhost:4200');
  }

  get paymentsEnabled(): boolean {
    return this.stripe !== null && this.priceId !== '';
  }

  async getOverview(user: ApplicationUser, now = new Date()): Promise<BillingOverview> {
    const month = toDateKey(now, user.company.timezone).slice(0, 7);
    const lastMonth = previousMonthKey(month);
    const [activeEmployees, lastMonthActiveEmployees] = await Promise.all([
      countActiveEmployees(this.prisma, user.companyId, month, user.company.timezone),
      countActiveEmployees(this.prisma, user.companyId, lastMonth, user.company.timezone),
    ]);
    const subscription = await this.syncPaymentRequirement(
      user.company,
      Math.max(activeEmployees, lastMonthActiveEmployees),
      now,
    );
    const graceUntil = this.graceUntil(subscription);

    return {
      plan: subscription.plan,
      status: subscription.status,
      month,
      activeEmployees,
      estimatedAmountCents: monthlyAmountCents(activeEmployees),
      lastMonth: {
        month: lastMonth,
        activeEmployees: lastMonthActiveEmployees,
        amountCents: monthlyAmountCents(lastMonthActiveEmployees),
      },
      freeActiveEmployees: FREE_ACTIVE_EMPLOYEES,
      pricePerActiveEmployeeCents: PRICE_PER_ACTIVE_EMPLOYEE_CENTS,
      paymentRequired: graceUntil !== null,
      graceUntil: graceUntil?.toISOString() ?? null,
      readOnly: this.isGraceOver(subscription, now),
      paymentsEnabled: this.paymentsEnabled,
      portalAvailable: this.paymentsEnabled && subscription.stripeCustomerId !== null,
    };
  }

  /** Read-only mode: an unpaid company past its grace period (payments configured only). */
  async isReadOnly(companyId: string, now = new Date()): Promise<boolean> {
    if (!this.paymentsEnabled) {
      return false;
    }
    const subscription = await this.prisma.subscription.findUnique({ where: { companyId } });
    return subscription !== null && this.isGraceOver(subscription, now);
  }

  /** Stripe Checkout page to subscribe to Essentiel (SEPA direct debit or card). */
  async createCheckout(user: ApplicationUser): Promise<{ url: string }> {
    const stripe = this.requireStripe();
    const subscription = await this.ensureSubscription(user.companyId);
    if (subscription.stripeSubscriptionId && subscription.status !== SubscriptionStatus.CANCELED) {
      throw new ConflictException('The company already has a subscription: use the customer portal');
    }

    const customerId = subscription.stripeCustomerId ?? (await this.createCustomer(stripe, user));
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      // Metered price: no quantity, the usage is reported every month.
      line_items: [{ price: this.priceId }],
      locale: 'fr',
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      customer_update: { address: 'auto', name: 'auto' },
      subscription_data: {
        metadata: { companyId: user.companyId },
        ...(this.taxRateId ? { default_tax_rates: [this.taxRateId] } : {}),
      },
      metadata: { companyId: user.companyId },
      success_url: `${this.appUrl}/abonnement?paiement=ok`,
      cancel_url: `${this.appUrl}/abonnement`,
    });
    if (!session.url) {
      throw new ServiceUnavailableException('The payment page is not available');
    }
    return { url: session.url };
  }

  /** Stripe customer portal: invoices, payment method, cancellation. */
  async createPortal(user: ApplicationUser): Promise<{ url: string }> {
    const stripe = this.requireStripe();
    const subscription = await this.prisma.subscription.findUnique({
      where: { companyId: user.companyId },
    });
    if (!subscription?.stripeCustomerId) {
      throw new ConflictException('The company has no Stripe customer yet');
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.appUrl}/abonnement`,
      locale: 'fr',
    });
    return { url: session.url };
  }

  /**
   * Stripe webhook. The signature of the raw body proves that Stripe sent it.
   * Stripe may send an event twice or out of order: each event is applied
   * once, and the subscription status is read back from Stripe instead of
   * being taken from the event.
   */
  async handleWebhook(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): Promise<{ received: true }> {
    const stripe = this.requireStripe();
    if (!this.webhookSecret || !rawBody || !signature) {
      throw new BadRequestException('Invalid Stripe webhook');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    if (await this.prisma.processedWebhook.findUnique({ where: { id: event.id } })) {
      return { received: true };
    }
    const change = await this.subscriptionChange(stripe, event);

    let failedPayment: Subscription | null = null;
    try {
      failedPayment = await this.prisma.$transaction(async (transaction) => {
        await transaction.processedWebhook.create({ data: { id: event.id } });
        return change ? this.applyChange(transaction, change) : null;
      });
    } catch (error: unknown) {
      // Processed meanwhile by a concurrent delivery of the same event.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return { received: true };
      }
      throw error;
    }

    if (failedPayment) {
      const company = await this.prisma.company.findUniqueOrThrow({
        where: { id: failedPayment.companyId },
        select: { id: true, name: true, timezone: true },
      });
      await this.warnAdministrators(company, failedPayment, (firstName, deadline) =>
        paymentFailedMail({
          firstName,
          companyName: company.name,
          deadline,
          link: `${this.appUrl}/abonnement`,
        }),
      );
    }
    return { received: true };
  }

  /**
   * Daily job, safe to run several times and on several instances: tracks who
   * has to pay, and records (then reports to Stripe) the active employees of
   * the month that just ended. A missed day is caught up the next one.
   */
  async runDaily(now = new Date()): Promise<void> {
    // Stripe retries an event for 3 days at most: 90 days of history is plenty.
    await this.prisma.processedWebhook.deleteMany({
      where: { receivedAt: { lt: new Date(now.getTime() - 90 * DAY_MS) } },
    });
    const companies = await this.prisma.company.findMany({
      select: { id: true, name: true, timezone: true },
    });

    for (const company of companies) {
      try {
        const month = toDateKey(now, company.timezone).slice(0, 7);
        const lastMonth = previousMonthKey(month);
        const [activeEmployees, lastMonthActiveEmployees] = await Promise.all([
          countActiveEmployees(this.prisma, company.id, month, company.timezone),
          countActiveEmployees(this.prisma, company.id, lastMonth, company.timezone),
        ]);
        const subscription = await this.syncPaymentRequirement(
          company,
          Math.max(activeEmployees, lastMonthActiveEmployees),
          now,
        );
        await this.recordUsage(company.id, lastMonth, lastMonthActiveEmployees, subscription);
      } catch (error: unknown) {
        this.logger.error(
          `Billing of company ${company.id} failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  /**
   * Starts the grace period the first time the company goes over the free
   * plan (this month or the last one) without paying, and ends it when it pays
   * or stays under the limit two months in a row. Unpaid invoices keep it.
   */
  private async syncPaymentRequirement(
    company: BilledCompany,
    activeEmployees: number,
    now: Date,
  ): Promise<Subscription> {
    const subscription = await this.ensureSubscription(company.id);
    if (!this.paymentsEnabled) {
      return subscription;
    }

    const needsPayment =
      activeEmployees > FREE_ACTIVE_EMPLOYEES && subscription.status !== SubscriptionStatus.ACTIVE;
    if (needsPayment && !subscription.paymentRequiredSince) {
      const started = await this.prisma.subscription.updateMany({
        where: { companyId: company.id, paymentRequiredSince: null },
        data: { paymentRequiredSince: now },
      });
      const updated = await this.prisma.subscription.findUniqueOrThrow({
        where: { companyId: company.id },
      });
      // Only the call that started the grace period warns, even with concurrent calls.
      if (started.count === 1) {
        await this.warnAdministrators(company, updated, (firstName, deadline) =>
          paymentRequiredMail({
            firstName,
            companyName: company.name,
            activeEmployees,
            deadline,
            link: `${this.appUrl}/abonnement`,
          }),
        );
      }
      return updated;
    }

    const unpaidInvoice = subscription.status === SubscriptionStatus.PAST_DUE;
    if (!needsPayment && !unpaidInvoice && subscription.paymentRequiredSince) {
      return this.prisma.subscription.update({
        where: { companyId: company.id },
        data: { paymentRequiredSince: null },
      });
    }
    return subscription;
  }

  /** E-mails the active administrators, with the end of the grace period. */
  private async warnAdministrators(
    company: BilledCompany,
    subscription: Subscription,
    mail: (firstName: string | null, deadline: string) => MailContent,
  ): Promise<void> {
    const graceUntil = this.graceUntil(subscription);
    if (!graceUntil) {
      return;
    }
    const deadline = formatMailDate(graceUntil, company.timezone);
    const administrators = await this.prisma.user.findMany({
      where: { companyId: company.id, role: UserRole.ADMIN, isActive: true, email: { not: null } },
      select: { email: true, firstName: true },
    });
    for (const administrator of administrators) {
      await this.mail.send(administrator.email as string, mail(administrator.firstName, deadline));
    }
  }

  private async recordUsage(
    companyId: string,
    month: string,
    activeEmployees: number,
    subscription: Subscription,
  ): Promise<void> {
    const key = { companyId_month: { companyId, month: dateKeyToDateColumn(`${month}-01`) } };
    const existing = await this.prisma.billingUsage.findUnique({ where: key });
    if (existing?.reportedAt) {
      // Billed: never changed afterwards, even if hours are corrected later.
      return;
    }

    const amountCents = monthlyAmountCents(activeEmployees);
    const usage = await this.prisma.billingUsage.upsert({
      where: key,
      create: { companyId, month: dateKeyToDateColumn(`${month}-01`), activeEmployees, amountCents },
      update: { activeEmployees, amountCents },
    });

    const customerId = subscription.stripeCustomerId;
    if (
      this.paymentsEnabled &&
      amountCents > 0 &&
      customerId &&
      subscription.status === SubscriptionStatus.ACTIVE
    ) {
      await this.reportUsage(usage.id, customerId, activeEmployees);
    }
  }

  /**
   * One meter event per company and month, at the time of the report, so it
   * lands in the billing period open in Stripe. Free months (3 active
   * employees or fewer) are never reported: the Stripe price is a plain
   * 3 € per unit, summed over the period.
   */
  private async reportUsage(usageId: string, customerId: string, activeEmployees: number): Promise<void> {
    // Claimed atomically: two runs never report the same month twice.
    const claim = await this.prisma.billingUsage.updateMany({
      where: { id: usageId, reportedAt: null },
      data: { reportedAt: new Date() },
    });
    if (claim.count !== 1) {
      return;
    }
    try {
      await this.requireStripe().billing.meterEvents.create({
        event_name: this.meterEvent,
        identifier: `usage-${usageId}`,
        payload: { stripe_customer_id: customerId, value: String(activeEmployees) },
      });
    } catch (error: unknown) {
      await this.prisma.billingUsage.update({ where: { id: usageId }, data: { reportedAt: null } });
      this.logger.error(
        `Usage ${usageId} not reported to Stripe: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async subscriptionChange(stripe: Stripe, event: Stripe.Event): Promise<SubscriptionChange | null> {
    let customerId: string | null = null;
    let subscriptionId: string | null = null;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription') {
          customerId = stripeId(session.customer);
          subscriptionId = stripeId(session.subscription);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        customerId = stripeId(event.data.object.customer);
        subscriptionId = event.data.object.id;
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        customerId = stripeId(event.data.object.customer);
        if (customerId) {
          const local = await this.prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId },
          });
          subscriptionId = local?.stripeSubscriptionId ?? null;
        }
        break;
      }
      default:
        return null;
    }

    if (!customerId || !subscriptionId) {
      return null;
    }
    const current = await stripe.subscriptions.retrieve(subscriptionId);
    return { customerId, subscriptionId, status: toSubscriptionStatus(current.status) };
  }

  /**
   * Applies the status read back from Stripe. Returns the subscription when a
   * failed payment has just started the grace period, so that the
   * administrators are warned once the transaction is committed.
   */
  private async applyChange(
    transaction: Prisma.TransactionClient,
    change: SubscriptionChange,
  ): Promise<Subscription | null> {
    const local = await transaction.subscription.findUnique({
      where: { stripeCustomerId: change.customerId },
    });
    if (!local) {
      // A customer created outside WorkHoraire.
      return null;
    }
    const canceled = change.status === SubscriptionStatus.CANCELED;
    if (canceled && local.stripeSubscriptionId && local.stripeSubscriptionId !== change.subscriptionId) {
      // An old subscription ended; the company has subscribed again since.
      return null;
    }

    let paymentRequiredSince = local.paymentRequiredSince;
    if (change.status === SubscriptionStatus.ACTIVE) {
      paymentRequiredSince = null;
    } else if (change.status === SubscriptionStatus.PAST_DUE) {
      // The grace period starts at the first failed payment, not at each retry.
      paymentRequiredSince = local.paymentRequiredSince ?? new Date();
    }

    const updated = await transaction.subscription.update({
      where: { id: local.id },
      data: {
        status: change.status,
        plan: canceled ? PlanCode.DECOUVERTE : PlanCode.ESSENTIEL,
        stripeSubscriptionId: canceled ? null : change.subscriptionId,
        paymentRequiredSince,
      },
    });
    const firstFailure = change.status === SubscriptionStatus.PAST_DUE && !local.paymentRequiredSince;
    return firstFailure ? updated : null;
  }

  private async createCustomer(stripe: Stripe, user: ApplicationUser): Promise<string> {
    const customer = await stripe.customers.create({
      name: user.company.name,
      email: user.email ?? undefined,
      preferred_locales: ['fr'],
      metadata: { companyId: user.companyId },
    });
    // Two administrators may click at the same time: the first customer wins.
    await this.prisma.subscription.updateMany({
      where: { companyId: user.companyId, stripeCustomerId: null },
      data: { stripeCustomerId: customer.id },
    });
    const subscription = await this.prisma.subscription.findUniqueOrThrow({
      where: { companyId: user.companyId },
    });
    return subscription.stripeCustomerId ?? customer.id;
  }

  private graceUntil(subscription: Subscription): Date | null {
    if (
      !this.paymentsEnabled ||
      subscription.status === SubscriptionStatus.ACTIVE ||
      !subscription.paymentRequiredSince
    ) {
      return null;
    }
    return new Date(subscription.paymentRequiredSince.getTime() + PAYMENT_GRACE_DAYS * DAY_MS);
  }

  private isGraceOver(subscription: Subscription, now: Date): boolean {
    const graceUntil = this.graceUntil(subscription);
    return graceUntil !== null && graceUntil.getTime() < now.getTime();
  }

  private ensureSubscription(companyId: string): Promise<Subscription> {
    return this.prisma.subscription.upsert({
      where: { companyId },
      create: { companyId },
      update: {},
    });
  }

  private requireStripe(): Stripe {
    if (!this.stripe || !this.priceId) {
      throw new ServiceUnavailableException('Online payment is not configured');
    }
    return this.stripe;
  }
}
