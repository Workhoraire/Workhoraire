import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { KeycloakRequest } from './auth.types';
import { KEYCLOAK_ROLES_METADATA } from './roles.decorator';

@Injectable()
export class ApplicationRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      KEYCLOAK_ROLES_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<KeycloakRequest>();
    const applicationUser = request.applicationUser;

    if (!applicationUser) {
      throw new UnauthorizedException('Application user is missing');
    }

    if (!requiredRoles.includes(applicationUser.role)) {
      throw new ForbiddenException('Insufficient application role');
    }

    return true;
  }
}
