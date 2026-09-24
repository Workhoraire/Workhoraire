import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, switchMap } from 'rxjs';
import { KeycloakRequest } from '../auth/auth.types';
import { ALLOWED_WHEN_READ_ONLY } from './allowed-when-read-only.decorator';
import { BillingService } from './billing.service';

const CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Read-only mode of the companies whose subscription is unpaid after the
 * grace period: every change is refused with 402 Payment Required, except the
 * routes marked @AllowedWhenReadOnly() (clocking and paying). Hours stay
 * readable and exportable. Interceptors run after the guards, once the
 * application user is known.
 */
@Injectable()
export class ReadOnlyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly billing: BillingService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http' || !this.billing.paymentsEnabled) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<KeycloakRequest>();
    const allowed = this.reflector.getAllAndOverride<boolean>(ALLOWED_WHEN_READ_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const companyId = request.applicationUser?.companyId;
    if (!companyId || allowed || !CHANGING_METHODS.has(request.method)) {
      return next.handle();
    }

    return from(this.billing.isReadOnly(companyId)).pipe(
      switchMap((readOnly) => {
        if (readOnly) {
          throw new HttpException(
            'The subscription is unpaid: the company is in read-only mode',
            HttpStatus.PAYMENT_REQUIRED,
          );
        }
        return next.handle();
      }),
    );
  }
}
