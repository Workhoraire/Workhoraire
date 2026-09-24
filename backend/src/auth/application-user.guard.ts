import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { KeycloakRequest } from './auth.types';

@Injectable()
export class ApplicationUserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<KeycloakRequest>();

    if (!request.user) {
      throw new UnauthorizedException('A valid Keycloak access token is required');
    }

    const applicationUser = await this.authService.findByKeycloakSubject(
      request.user.sub,
    );

    if (!applicationUser) {
      throw new ForbiddenException(
        'The Keycloak user is not associated with a company',
      );
    }

    if (!applicationUser.isActive) {
      throw new ForbiddenException('The application user is inactive');
    }

    // Notifications go to the verified address of the sign-in account, which
    // its owner may change in Keycloak; nobody else can change it.
    const tokenEmail = request.user.email?.trim().toLowerCase();
    if (tokenEmail && request.user.email_verified === true && tokenEmail !== applicationUser.email) {
      await this.authService.updateEmail(applicationUser.id, tokenEmail);
      applicationUser.email = tokenEmail;
    }

    request.applicationUser = applicationUser;
    return true;
  }
}
