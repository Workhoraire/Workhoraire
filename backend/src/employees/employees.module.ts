import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractRefreshJob } from './contract-refresh.job';
import { EmployeeInvitationsController } from './employee-invitations.controller';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [AuthModule, NotificationsModule, PrismaModule],
  controllers: [EmployeesController, EmployeeInvitationsController],
  providers: [EmployeesService, ContractRefreshJob],
})
export class EmployeesModule {}
