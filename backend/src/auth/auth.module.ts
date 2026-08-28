import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { ApplicationUserGuard } from './application-user.guard';
import { AuthService } from './auth.service';
import { KeycloakAuthGuard } from './keycloak-auth.guard';
import { ApplicationRolesGuard } from './application-roles.guard';
import { KeycloakService } from './keycloak.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    ApplicationRolesGuard,
    ApplicationUserGuard,
    AuthService,
    KeycloakAuthGuard,
    KeycloakService,
  ],
  exports: [
    ApplicationRolesGuard,
    ApplicationUserGuard,
    AuthService,
    KeycloakAuthGuard,
    KeycloakService,
  ],
})
export class AuthModule {}
