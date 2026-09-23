import { BadRequestException } from '@nestjs/common';
import { Matches } from 'class-validator';
import { daysBetween, isValidDateKey } from './local-date';

export const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Longest period accepted by timesheet, export and listing endpoints. */
export const MAX_PERIOD_DAYS = 93;

export class PeriodQueryDto {
  @Matches(DATE_KEY_REGEX, { message: 'from must use the YYYY-MM-DD format' })
  from!: string;

  @Matches(DATE_KEY_REGEX, { message: 'to must use the YYYY-MM-DD format' })
  to!: string;
}

export function assertValidPeriod(
  from: string,
  to: string,
  maxDays = MAX_PERIOD_DAYS,
): void {
  if (!isValidDateKey(from) || !isValidDateKey(to)) {
    throw new BadRequestException('Dates must be valid calendar dates (YYYY-MM-DD)');
  }

  if (to < from) {
    throw new BadRequestException('The end date must be on or after the start date');
  }

  if (daysBetween(from, to) + 1 > maxDays) {
    throw new BadRequestException(`The period cannot exceed ${maxDays} days`);
  }
}
