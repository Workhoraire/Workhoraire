import { Transform } from 'class-transformer';
import {
  Equals,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NoWebAddress } from '../../common/validation/no-web-address';
import { trimString } from '../../common/validation/trim-string';

export class CreateCompanyDto {
  @Transform(trimString)
  @NoWebAddress()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\s/g, '') : value,
  )
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'siret must contain exactly 14 digits',
  })
  siret?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  timezone?: string;

  /** The administrator's name: the sign-up page only asks for an e-mail and a password. */
  @Transform(trimString)
  @NoWebAddress()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @Transform(trimString)
  @NoWebAddress()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  /** Terms of sale and data processing agreement, accepted with a check box. */
  @Equals(true, { message: 'The terms of sale must be accepted' })
  acceptTerms!: boolean;
}
