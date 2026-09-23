import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ApplicationRolesGuard } from '../auth/application-roles.guard';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { PeriodQueryDto } from '../common/dates/period';
import { EmployeeTimesheet, TeamTimesheet } from './timesheet.types';
import { TimesheetsService } from './timesheets.service';

@Controller('timesheets')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Get('me')
  getOwnTimesheet(
    @CurrentUser() user: ApplicationUser,
    @Query() query: PeriodQueryDto,
  ): Promise<EmployeeTimesheet> {
    return this.timesheetsService.getOwnTimesheet(user, query.from, query.to);
  }

  @Get('team')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getTeamTimesheet(
    @CurrentUser() user: ApplicationUser,
    @Query() query: PeriodQueryDto,
  ): Promise<TeamTimesheet> {
    return this.timesheetsService.getTeamTimesheet(user, query.from, query.to);
  }

  @Get('employees/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getEmployeeTimesheet(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) employeeId: string,
    @Query() query: PeriodQueryDto,
  ): Promise<EmployeeTimesheet> {
    return this.timesheetsService.getEmployeeTimesheet(
      user,
      employeeId,
      query.from,
      query.to,
    );
  }
}
