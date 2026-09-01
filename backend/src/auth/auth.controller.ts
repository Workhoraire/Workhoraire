import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicationUserGuard } from './application-user.guard';
import { CurrentUser } from './current-user.decorator';
import { KeycloakAuthGuard } from './keycloak-auth.guard';
import { ApplicationUser, ApplicationUserResponse } from './auth.types';

@Controller('me')
export class AuthController {
  @Get()
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard)
  getCurrentUser(@CurrentUser() user: ApplicationUser): ApplicationUserResponse {
    return {
      id: user.id,
      subject: user.keycloakSubject,
      email: user.email ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      isActive: user.isActive,
      role: user.role,
      company: {
        id: user.company.id,
        name: user.company.name,
      },
    };
  }
}
