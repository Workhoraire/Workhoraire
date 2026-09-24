import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { DATE_KEY_REGEX } from '../../common/dates/period';
import { NoWebAddress } from '../../common/validation/no-web-address';
import { trimString } from '../../common/validation/trim-string';

export class UpdateEmployeeDto {
  @Transform(trimString)
  @NoWebAddress()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName?: string;

  @Transform(trimString)
  @NoWebAddress()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  /** Contractual weekly working time in minutes, from 1 h to 48 h. */
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(2880)
  weeklyContractMinutes?: number;

  /** First day (rounded to its Monday) of the new contract; the current week by default. */
  @IsOptional()
  @Matches(DATE_KEY_REGEX, { message: 'contractEffectiveFrom must use the YYYY-MM-DD format' })
  contractEffectiveFrom?: string;

  /** Payroll employee number (matricule); an empty string removes it. */
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  payrollId?: string;
}
