import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApplicationUserResponse,
  KeycloakUser,
} from '../auth/auth.types';
import { CurrentKeycloakUser } from '../auth/current-keycloak-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { EmployeeInvitationPreview } from './employee.types';
import { EmployeesService } from './employees.service';

@Controller('employee-invitations')
export class EmployeeInvitationsController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  /**
   * Public on purpose: the unguessable link is the only credential, and the
   * answer only tells the invited person who invites them.
   */
  @Get(':token')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getInvitation(@Param('token') token: string): Promise<EmployeeInvitationPreview> {
    return this.employeesService.getInvitationPreview(token);
  }

  @Post(':token/accept')
  @UseGuards(KeycloakAuthGuard)
  acceptInvitation(
    @Param('token') token: string,
    @CurrentKeycloakUser() keycloakUser: KeycloakUser,
  ): Promise<ApplicationUserResponse> {
    return this.employeesService.acceptInvitation(token, keycloakUser);
  }
}
