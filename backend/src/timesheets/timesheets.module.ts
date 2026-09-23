import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TimesheetsController } from './timesheets.controller';
import { TimesheetsService } from './timesheets.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [TimesheetsController],
  providers: [TimesheetsService],
  exports: [TimesheetsService],
})
export class TimesheetsModule {}
