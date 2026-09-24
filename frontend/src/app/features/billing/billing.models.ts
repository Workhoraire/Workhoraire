export type PlanCode = 'DECOUVERTE' | 'ESSENTIEL';
export type SubscriptionStatus = 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface BillingOverview {
  plan: PlanCode;
  status: SubscriptionStatus;
  /** "YYYY-MM" */
  month: string;
  activeEmployees: number;
  estimatedAmountCents: number;
  lastMonth: { month: string; activeEmployees: number; amountCents: number };
  freeActiveEmployees: number;
  pricePerActiveEmployeeCents: number;
  paymentRequired: boolean;
  graceUntil: string | null;
  readOnly: boolean;
  paymentsEnabled: boolean;
  portalAvailable: boolean;
}
