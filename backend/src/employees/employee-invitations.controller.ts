import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApplicationUserResponse,
  KeycloakUser,
} from '../auth/auth.types';
import { CurrentKeycloakUser } from '../auth/current-keycloak-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { EmployeesService } from './employees.service';

@Controller('employee-invitations')
export class EmployeeInvitationsController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  @Post(':token/accept')
  @UseGuards(KeycloakAuthGuard)
  acceptInvitation(
    @Param('token') token: string,
    @CurrentKeycloakUser() keycloakUser: KeycloakUser,
  ): Promise<ApplicationUserResponse> {
    return this.employeesService.acceptInvitation(token, keycloakUser);
  }
}
