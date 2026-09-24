import { BadRequestException } from '@nestjs/common';
import { assertValidPeriod } from './period';

describe('assertValidPeriod', () => {
  it('accepts a period whose whole weeks stay within the supported years', () => {
    expect(() => assertValidPeriod('2000-01-03', '2000-01-09')).not.toThrow();
    expect(() => assertValidPeriod('2100-12-20', '2100-12-26')).not.toThrow();
  });

  it('refuses, with a 400, a period whose weeks leave the supported years', () => {
    // Saturday 1 January 2000: its week starts on Monday 27 December 1999.
    expect(() => assertValidPeriod('2000-01-01', '2000-01-02')).toThrow(BadRequestException);
    // Friday 31 December 2100: its week ends on Sunday 2 January 2101.
    expect(() => assertValidPeriod('2100-12-28', '2100-12-31')).toThrow(BadRequestException);
  });

  it('refuses inverted, too long or invalid periods', () => {
    expect(() => assertValidPeriod('2026-09-30', '2026-09-01')).toThrow(BadRequestException);
    expect(() => assertValidPeriod('2026-01-01', '2026-12-31')).toThrow(BadRequestException);
    expect(() => assertValidPeriod('2026-02-30', '2026-03-01')).toThrow(BadRequestException);
  });
});
