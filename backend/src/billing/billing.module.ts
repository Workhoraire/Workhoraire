import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingController } from './billing.controller';
import { BillingJob } from './billing.job';
import { BillingService } from './billing.service';
import { ReadOnlyInterceptor } from './read-only.interceptor';
import { stripeProvider } from './stripe.provider';

@Module({
  imports: [AuthModule, NotificationsModule, PrismaModule],
  controllers: [BillingController],
  providers: [
    stripeProvider,
    BillingService,
    BillingJob,
    { provide: APP_INTERCEPTOR, useClass: ReadOnlyInterceptor },
  ],
  exports: [BillingService],
})
export class BillingModule {}
