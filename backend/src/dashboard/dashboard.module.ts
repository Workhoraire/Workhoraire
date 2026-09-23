import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TimesheetsModule } from '../timesheets/timesheets.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AuthModule, PrismaModule, TimesheetsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
