import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { ApplicationRolesGuard } from '../auth/application-roles.guard';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AllowedWhenReadOnly } from '../billing/allowed-when-read-only.decorator';
import { CreateEmployeeInvitationDto } from './dto/create-employee-invitation.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeInvitationResponse, EmployeeResponse } from './employee.types';
import { EmployeesService } from './employees.service';

@Controller('employees')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
@Roles(UserRole.ADMIN)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  listEmployees(@CurrentUser() currentUser: ApplicationUser): Promise<EmployeeResponse[]> {
    return this.employeesService.listEmployees(currentUser.companyId);
  }

  @Get(':id')
  getEmployee(
    @CurrentUser() currentUser: ApplicationUser,
    @Param('id', ParseUUIDPipe) employeeId: string,
  ): Promise<EmployeeResponse> {
    return this.employeesService.getEmployee(currentUser.companyId, employeeId);
  }

  @Post('invitations')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  createInvitation(
    @CurrentUser() currentUser: ApplicationUser,
    @Body() dto: CreateEmployeeInvitationDto,
  ): Promise<EmployeeInvitationResponse> {
    return this.employeesService.createInvitation(currentUser, dto);
  }

  /** Also in read-only mode: an unpaid company must still be able to revoke an access. */
  @Patch(':id')
  @AllowedWhenReadOnly()
  updateEmployee(
    @CurrentUser() currentUser: ApplicationUser,
    @Param('id', ParseUUIDPipe) employeeId: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<EmployeeResponse> {
    return this.employeesService.updateEmployee(currentUser, employeeId, dto);
  }
}
