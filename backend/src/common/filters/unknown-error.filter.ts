import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * Nest sends back any error carrying a statusCode and a message, whatever
 * its origin: a Stripe error would reach the browser as a 401 "Invalid API
 * Key", read by the app as an expired session. Only HTTP exceptions and the
 * client errors that libraries mark as safe to expose (the body parser's 400
 * and 413) keep their status. Anything else becomes a plain 500, logged here.
 */
@Catch()
export class UnknownErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(UnknownErrorFilter.name);

  override catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException || isExposedClientError(exception)) {
      super.catch(exception, host);
      return;
    }
    this.logger.error(
      exception instanceof Error ? (exception.stack ?? exception.message) : String(exception),
    );
    super.catch(new InternalServerErrorException(), host);
  }
}

/** Errors built with http-errors (body parser) set `expose` for client errors only. */
export function isExposedClientError(exception: unknown): boolean {
  if (typeof exception !== 'object' || exception === null) {
    return false;
  }
  const { expose, statusCode } = exception as { expose?: unknown; statusCode?: unknown };
  return expose === true && typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500;
}
