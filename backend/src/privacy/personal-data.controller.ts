import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationUserGuard } from '../auth/application-user.guard';
import { ApplicationUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { PersonalDataService } from './personal-data.service';

@Controller('me')
export class PersonalDataController {
  constructor(private readonly personalData: PersonalDataService) {}

  /** Downloads everything stored about the signed-in person, as a JSON file. */
  @Get('data-export')
  @UseGuards(KeycloakAuthGuard, ApplicationUserGuard)
  async export(
    @CurrentUser() user: ApplicationUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Record<string, unknown>> {
    const data = await this.personalData.export(user);
    const day = new Date().toISOString().slice(0, 10);
    response.setHeader('Content-Disposition', `attachment; filename="workhoraire-mes-donnees-${day}.json"`);
    response.setHeader('Cache-Control', 'no-store');
    return data;
  }
}
