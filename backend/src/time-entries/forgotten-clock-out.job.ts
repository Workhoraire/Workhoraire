import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimeEntriesService } from './time-entries.service';

@Injectable()
export class ForgottenClockOutJob {
  private readonly logger = new Logger(ForgottenClockOutJob.name);

  constructor(private readonly timeEntries: TimeEntriesService) {}

  /** Every 15 minutes: an employee is reminded soon after the 12 hours pass. */
  @Cron('*/15 * * * *', { name: 'forgotten-clock-out' })
  async remind(): Promise<void> {
    const sent = await this.timeEntries.remindForgottenClockOuts();
    if (sent > 0) {
      this.logger.log(`${sent} forgotten clock-out reminder(s) sent`);
    }
  }
}
