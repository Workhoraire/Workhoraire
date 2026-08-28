import { UserRole } from '@prisma/client';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicationUserGuard } from './application-user.guard';
import { CurrentUser } from './current-user.decorator';
import { KeycloakAuthGuard } from './keycloak-auth.guard';
import { ApplicationUser } from './auth.types';

interface CurrentUserResponse {
  id: string;
  subject: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  company: {
    id: string;
    name: string;
  };
}

@Controller('me')
export class AuthController {
  @Get()
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard)
  getCurrentUser(@CurrentUser() user: ApplicationUser): CurrentUserResponse {
    return {
      id: user.id,
      subject: user.keycloakSubject,
      email: user.email ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      role: user.role,
      company: {
        id: user.company.id,
        name: user.company.name,
      },
    };
  }
}
