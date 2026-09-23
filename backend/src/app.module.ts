import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AbsencesModule } from './absences/absences.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmployeesModule } from './employees/employees.module';
import { ExportsModule } from './exports/exports.module';
import { HealthController } from './health/health.controller';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PrismaModule } from './prisma/prisma.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { TimesheetsModule } from './timesheets/timesheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    AbsencesModule,
    AuthModule,
    DashboardModule,
    EmployeesModule,
    ExportsModule,
    OnboardingModule,
    PrismaModule,
    TimeEntriesModule,
    TimesheetsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
