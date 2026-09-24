import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { AllowedWhenReadOnly } from '../billing/allowed-when-read-only.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { PeriodQueryDto } from '../common/dates/period';
import { ClockDto, CloseOpenEntryDto } from './dto/time-entry.dto';
import {
  ClockStatusResponse,
  TimeEntryAuditLogResponse,
  TimeEntryResponse,
} from './time-entry.types';
import { TimeEntriesService } from './time-entries.service';

/**
 * Clocking endpoints of the authenticated employee, whatever their role.
 * Clocking never stops, even when the subscription is unpaid.
 */
@Controller('time-clock')
@AllowedWhenReadOnly()
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard)
export class TimeClockController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get('status')
  getStatus(@CurrentUser() user: ApplicationUser): Promise<ClockStatusResponse> {
    return this.timeEntriesService.getClockStatus(user);
  }

  @Post('clock-in')
  clockIn(
    @CurrentUser() user: ApplicationUser,
    @Body() dto: ClockDto,
  ): Promise<TimeEntryResponse> {
    return this.timeEntriesService.clockIn(user, dto);
  }

  @Post('clock-out')
  clockOut(
    @CurrentUser() user: ApplicationUser,
    @Body() dto: ClockDto,
  ): Promise<TimeEntryResponse> {
    return this.timeEntriesService.clockOut(user, dto);
  }

  @Post('close-open-entry')
  closeOpenEntry(
    @CurrentUser() user: ApplicationUser,
    @Body() dto: CloseOpenEntryDto,
  ): Promise<TimeEntryResponse> {
    return this.timeEntriesService.closeOwnOpenEntry(user, dto);
  }

  @Get('audit-logs')
  listOwnAuditLogs(
    @CurrentUser() user: ApplicationUser,
    @Query() query: PeriodQueryDto,
  ): Promise<TimeEntryAuditLogResponse[]> {
    return this.timeEntriesService.listAuditLogs(user, {
      from: query.from,
      to: query.to,
      employeeId: user.id,
    });
  }
}
