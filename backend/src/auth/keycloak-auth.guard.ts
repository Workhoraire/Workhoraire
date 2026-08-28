import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakRequest } from './auth.types';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<KeycloakRequest>();
    const accessToken = request.kauth?.grant?.access_token;

    if (!accessToken?.content?.sub) {
      throw new UnauthorizedException('A valid Keycloak access token is required');
    }

    request.user = accessToken.content;
    return true;
  }
}
