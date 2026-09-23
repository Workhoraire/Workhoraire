import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import {
  AuditLogQueryDto,
  CreateTimeEntryDto,
  DeleteTimeEntryDto,
  UpdateTimeEntryDto,
} from './dto/time-entry.dto';
import { TimeEntryAuditLogResponse, TimeEntryResponse } from './time-entry.types';
import { TimeEntriesService } from './time-entries.service';

/** Corrections of the company's time entries, always audited. */
@Controller('time-entries')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post()
  createEntry(
    @CurrentUser() user: ApplicationUser,
    @Body() dto: CreateTimeEntryDto,
  ): Promise<TimeEntryResponse> {
    return this.timeEntriesService.createEntry(user, dto);
  }

  @Patch(':id')
  updateEntry(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) entryId: string,
    @Body() dto: UpdateTimeEntryDto,
  ): Promise<TimeEntryResponse> {
    return this.timeEntriesService.updateEntry(user, entryId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEntry(
    @CurrentUser() user: ApplicationUser,
    @Param('id', ParseUUIDPipe) entryId: string,
    @Body() dto: DeleteTimeEntryDto,
  ): Promise<void> {
    return this.timeEntriesService.deleteEntry(user, entryId, dto);
  }

  @Get('audit-logs')
  listAuditLogs(
    @CurrentUser() user: ApplicationUser,
    @Query() query: AuditLogQueryDto,
  ): Promise<TimeEntryAuditLogResponse[]> {
    return this.timeEntriesService.listAuditLogs(user, query);
  }
}
