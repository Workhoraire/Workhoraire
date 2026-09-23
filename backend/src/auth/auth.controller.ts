import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicationUserGuard } from './application-user.guard';
import { CurrentUser } from './current-user.decorator';
import { KeycloakAuthGuard } from './keycloak-auth.guard';
import {
  ApplicationUser,
  ApplicationUserResponse,
  toApplicationUserResponse,
} from './auth.types';

@Controller('me')
export class AuthController {
  @Get()
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard)
  getCurrentUser(@CurrentUser() user: ApplicationUser): ApplicationUserResponse {
    return toApplicationUserResponse(user, user.company);
  }
}
