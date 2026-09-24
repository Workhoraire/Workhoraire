import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PersonalDataController } from './personal-data.controller';
import { PersonalDataService } from './personal-data.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PersonalDataController],
  providers: [PersonalDataService],
})
export class PrivacyModule {}
