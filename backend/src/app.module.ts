import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { EmployeesModule } from './employees/employees.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    AuthModule,
    EmployeesModule,
    OnboardingModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
