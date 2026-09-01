import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApplicationUserResponse, KeycloakUser } from '../auth/auth.types';
import { CurrentKeycloakUser } from '../auth/current-keycloak-user.decorator';
import { KeycloakAuthGuard } from '../auth/keycloak-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('company')
  @UseGuards(KeycloakAuthGuard)
  createCompany(
    @CurrentKeycloakUser() keycloakUser: KeycloakUser,
    @Body() dto: CreateCompanyDto,
  ): Promise<ApplicationUserResponse> {
    return this.onboardingService.createCompanyForUser(keycloakUser, dto);
  }
}
