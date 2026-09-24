import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakRequest } from './auth.types';
import { KeycloakService } from './keycloak.service';

const BEARER = /^Bearer\s+(\S+)$/i;

/** Requires a valid Keycloak access token (Authorization: Bearer …) and exposes its claims. */
@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(private readonly keycloak: KeycloakService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<KeycloakRequest>();
    const accessToken = BEARER.exec(request.headers.authorization ?? '')?.[1];
    const user = accessToken ? await this.keycloak.verifyAccessToken(accessToken) : null;

    if (!user) {
      throw new UnauthorizedException('A valid Keycloak access token is required');
    }

    request.user = user;
    return true;
  }
}
