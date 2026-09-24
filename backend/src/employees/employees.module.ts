import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeeInvitationsController } from './employee-invitations.controller';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [AuthModule, NotificationsModule, PrismaModule],
  controllers: [EmployeesController, EmployeeInvitationsController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
