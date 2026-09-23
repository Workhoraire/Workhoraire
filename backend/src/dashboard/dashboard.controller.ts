import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ApplicationRolesGuard } from '../auth/application-roles.guard';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { DashboardService, TeamDashboardResponse } from './dashboard.service';

@Controller('dashboard')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('team')
  getTeamDashboard(@CurrentUser() user: ApplicationUser): Promise<TeamDashboardResponse> {
    return this.dashboardService.getTeamDashboard(user);
  }
}
