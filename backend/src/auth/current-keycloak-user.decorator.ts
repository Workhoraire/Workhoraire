import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakRequest, KeycloakUser } from './auth.types';

export const CurrentKeycloakUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): KeycloakUser => {
    const request = context.switchToHttp().getRequest<KeycloakRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Keycloak user is missing');
    }

    return request.user;
  },
);
