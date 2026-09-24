import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { resolve } from 'node:path';
import { AbsencesModule } from './absences/absences.module';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { validateConfig } from './common/config/validate-config';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmployeesModule } from './employees/employees.module';
import { ExportsModule } from './exports/exports.module';
import { HealthController } from './health/health.controller';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrivacyModule } from './privacy/privacy.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { TimesheetsModule } from './timesheets/timesheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../.env'),
      isGlobal: true,
      validate: validateConfig,
    }),
    // Requests per client IP and per minute: a brake on abuse, far above normal use.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          { ttl: 60_000, limit: Number(config.get('THROTTLE_LIMIT_PER_MINUTE', 300)) },
        ],
      }),
    }),
    ScheduleModule.forRoot(),
    AbsencesModule,
    AuthModule,
    BillingModule,
    DashboardModule,
    EmployeesModule,
    ExportsModule,
    OnboardingModule,
    PrismaModule,
    PrivacyModule,
    TimeEntriesModule,
    TimesheetsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
