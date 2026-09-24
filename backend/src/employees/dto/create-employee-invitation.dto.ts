import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { NoWebAddress } from '../../common/validation/no-web-address';
import { trimString } from '../../common/validation/trim-string';

const normalizeEmail = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateEmployeeInvitationDto {
  @Transform(trimString)
  @NoWebAddress()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @Transform(trimString)
  @NoWebAddress()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /** Contractual weekly working time in minutes, from 1 h to 48 h. */
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(2880)
  weeklyContractMinutes?: number;
}
