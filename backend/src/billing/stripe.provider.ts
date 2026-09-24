import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const STRIPE_CLIENT = Symbol('STRIPE_CLIENT');

/** The Stripe client, or null when STRIPE_SECRET_KEY is not set (payments disabled). */
export const stripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Stripe | null => {
    const secretKey = config.get<string>('STRIPE_SECRET_KEY', '');
    return secretKey ? new Stripe(secretKey) : null;
  },
};
