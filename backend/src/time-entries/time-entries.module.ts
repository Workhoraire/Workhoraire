import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TimesheetsModule } from '../timesheets/timesheets.module';
import { ForgottenClockOutJob } from './forgotten-clock-out.job';
import { TimeClockController } from './time-clock.controller';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';

@Module({
  imports: [AuthModule, NotificationsModule, PrismaModule, TimesheetsModule],
  controllers: [TimeClockController, TimeEntriesController],
  providers: [TimeEntriesService, ForgottenClockOutJob],
})
export class TimeEntriesModule {}
