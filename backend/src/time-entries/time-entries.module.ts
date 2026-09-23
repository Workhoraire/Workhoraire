import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TimesheetsModule } from '../timesheets/timesheets.module';
import { TimeClockController } from './time-clock.controller';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';

@Module({
  imports: [AuthModule, PrismaModule, TimesheetsModule],
  controllers: [TimeClockController, TimeEntriesController],
  providers: [TimeEntriesService],
})
export class TimeEntriesModule {}
