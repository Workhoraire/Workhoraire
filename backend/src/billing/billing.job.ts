import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BillingService } from './billing.service';

@Injectable()
export class BillingJob {
  constructor(private readonly billing: BillingService) {}

  /** Every day at 04:00 UTC; the job is idempotent, so a missed day is caught up. */
  @Cron('0 4 * * *', { name: 'billing-daily', timeZone: 'UTC' })
  async runDaily(): Promise<void> {
    await this.billing.runDaily();
  }
}
