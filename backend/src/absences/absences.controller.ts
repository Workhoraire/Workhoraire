import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { AbsenceRequestResponse } from './absence.types';
import { AbsencesService } from './absences.service';
import {
  CreateAbsenceRequestDto,
  ListAbsenceRequestsQueryDto,
  ReviewAbsenceRequestDto,
} from './dto/absence.dto';

@Controller('absences')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Get('me')
  listOwnRequests(
    @CurrentUser() user: ApplicationUser,
    @Query() query: ListAbsenceRequestsQueryDto,
  ): Promise<AbsenceRequestResponse[]> {
    return this.absencesService.listOwnRequests(user, query);
  }

  @Post()
  createRequest(
    @CurrentUser() user: ApplicationUser,
    @Body() dto: CreateAbsenceRequestDto,
  ): Promise<AbsenceRequestResponse> {
    return this.absencesService.createRequest(user, dto);
  }

  @Post(':id/cancel')
  cancelOwnRequest(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) requestId: string,
  ): Promise<AbsenceRequestResponse> {
    return this.absencesService.cancelOwnRequest(user, requestId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  listCompanyRequests(
    @CurrentUser() user: ApplicationUser,
    @Query() query: ListAbsenceRequestsQueryDto,
  ): Promise<AbsenceRequestResponse[]> {
    return this.absencesService.listCompanyRequests(user, query);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  approveRequest(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) requestId: string,
    @Body() dto: ReviewAbsenceRequestDto,
  ): Promise<AbsenceRequestResponse> {
    return this.absencesService.approveRequest(user, requestId, dto);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  rejectRequest(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) requestId: string,
    @Body() dto: ReviewAbsenceRequestDto,
  ): Promise<AbsenceRequestResponse> {
    return this.absencesService.rejectRequest(user, requestId, dto);
  }
}
