import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationUser, KeycloakRequest } from './auth.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ApplicationUser => {
    const request = context.switchToHttp().getRequest<KeycloakRequest>();

    if (!request.applicationUser) {
      throw new UnauthorizedException('Application user is missing');
    }

    return request.applicationUser;
  },
);
