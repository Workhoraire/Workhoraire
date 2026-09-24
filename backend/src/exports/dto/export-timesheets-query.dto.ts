import { IsIn, IsOptional } from 'class-validator';
import { PeriodQueryDto } from '../../common/dates/period';
import { ExportGranularity } from '../exports.service';

export class ExportTimesheetsQueryDto extends PeriodQueryDto {
  @IsOptional()
  @IsIn(['week', 'day'])
  granularity?: ExportGranularity;
}
