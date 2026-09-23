import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TimesheetsModule } from '../timesheets/timesheets.module';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';

@Module({
  imports: [AuthModule, TimesheetsModule],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
