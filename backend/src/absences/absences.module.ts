import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AbsencesController } from './absences.controller';
import { AbsencesService } from './absences.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AbsencesController],
  providers: [AbsencesService],
})
export class AbsencesModule {}
