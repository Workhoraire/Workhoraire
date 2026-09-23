import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { AbsenceStatus, AbsenceType } from '@prisma/client';
import { DATE_KEY_REGEX } from '../../common/dates/period';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAbsenceRequestDto {
  @IsEnum(AbsenceType)
  type!: AbsenceType;

  @Matches(DATE_KEY_REGEX, { message: 'startDate must use the YYYY-MM-DD format' })
  startDate!: string;

  @Matches(DATE_KEY_REGEX, { message: 'endDate must use the YYYY-MM-DD format' })
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  startsAfternoon?: boolean;

  @IsOptional()
  @IsBoolean()
  endsMorning?: boolean;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class ReviewAbsenceRequestDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class ListAbsenceRequestsQueryDto {
  @IsOptional()
  @IsEnum(AbsenceStatus)
  status?: AbsenceStatus;

  @IsOptional()
  @Matches(DATE_KEY_REGEX, { message: 'from must use the YYYY-MM-DD format' })
  from?: string;

  @IsOptional()
  @Matches(DATE_KEY_REGEX, { message: 'to must use the YYYY-MM-DD format' })
  to?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
