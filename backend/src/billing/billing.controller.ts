import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { ApplicationRolesGuard } from '../auth/application-roles.guard';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AllowedWhenReadOnly } from './allowed-when-read-only.decorator';
import { BillingOverview, BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  /** Plan, active employees of the month and amount, for the administrator. */
  @Get()
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
  @Roles(UserRole.ADMIN)
  getOverview(@CurrentUser() user: ApplicationUser): Promise<BillingOverview> {
    return this.billing.getOverview(user);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
  @Roles(UserRole.ADMIN)
  @AllowedWhenReadOnly()
  createCheckout(@CurrentUser() user: ApplicationUser): Promise<{ url: string }> {
    return this.billing.createCheckout(user);
  }

  @Post('portal')
  @HttpCode(HttpStatus.OK)
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
  @Roles(UserRole.ADMIN)
  @AllowedWhenReadOnly()
  createPortal(@CurrentUser() user: ApplicationUser): Promise<{ url: string }> {
    return this.billing.createPortal(user);
  }

  /** Called by Stripe: authenticated by the signature of the raw body, not by a token. */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string | undefined,
  ): Promise<{ received: true }> {
    return this.billing.handleWebhook(request.rawBody, signature);
  }
}
