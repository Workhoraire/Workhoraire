import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { PeriodQueryDto } from '../../common/dates/period';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** ISO 8601 date-time with an explicit offset, e.g. 2026-09-23T08:00:00+02:00. */
const INSTANT_WITH_OFFSET = /T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
const INSTANT_MESSAGE = 'must be an ISO 8601 date-time with a timezone offset';

export class ClockDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

/** Closes the employee's own forgotten entry with a declared end time. */
export class CloseOpenEntryDto {
  @IsISO8601({ strict: true })
  @Matches(INSTANT_WITH_OFFSET, { message: `endAt ${INSTANT_MESSAGE}` })
  endAt!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

export class CreateTimeEntryDto {
  @IsUUID()
  userId!: string;

  @IsISO8601({ strict: true })
  @Matches(INSTANT_WITH_OFFSET, { message: `startAt ${INSTANT_MESSAGE}` })
  startAt!: string;

  @IsISO8601({ strict: true })
  @Matches(INSTANT_WITH_OFFSET, { message: `endAt ${INSTANT_MESSAGE}` })
  endAt!: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

export class UpdateTimeEntryDto {
  @IsOptional()
  @IsISO8601({ strict: true })
  @Matches(INSTANT_WITH_OFFSET, { message: `startAt ${INSTANT_MESSAGE}` })
  startAt?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  @Matches(INSTANT_WITH_OFFSET, { message: `endAt ${INSTANT_MESSAGE}` })
  endAt?: string;

  /** An empty note removes the existing one. */
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

export class DeleteTimeEntryDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

export class AuditLogQueryDto extends PeriodQueryDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
