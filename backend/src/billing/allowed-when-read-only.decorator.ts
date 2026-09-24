import { SetMetadata } from '@nestjs/common';

export const ALLOWED_WHEN_READ_ONLY = 'allowedWhenReadOnly';

/**
 * The route stays available when an unpaid company is in read-only mode:
 * clocking (the legal record of hours is never interrupted), paying, and
 * managing the employees' accounts (an access can always be revoked).
 */
export const AllowedWhenReadOnly = (): MethodDecorator & ClassDecorator =>
  SetMetadata(ALLOWED_WHEN_READ_ONLY, true);
