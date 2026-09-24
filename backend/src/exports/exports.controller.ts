import { Controller, Get, Query, StreamableFile, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ApplicationRolesGuard } from '../auth/application-roles.guard';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ExportTimesheetsQueryDto } from './dto/export-timesheets-query.dto';
import { ExportsService } from './exports.service';

@Controller('exports')
@UseGuards(KeycloakAuthGuard, ApplicationUserGuard, ApplicationRolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Get('timesheets')
  async exportTimesheets(
    @CurrentUser() user: ApplicationUser,
    @Query() query: ExportTimesheetsQueryDto,
  ): Promise<StreamableFile> {
    const file = await this.exportsService.timesheetCsv(
      user,
      query.from,
      query.to,
      query.granularity ?? 'week',
    );

    return new StreamableFile(Buffer.from(file.content, 'utf8'), {
      type: 'text/csv; charset=utf-8',
      disposition: `attachment; filename="${file.filename}"`,
    });
  }
}
