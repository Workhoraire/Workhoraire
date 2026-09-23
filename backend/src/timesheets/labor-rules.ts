/**
 * Default thresholds of the French Code du travail used to compute overtime
 * and compliance alerts. Collective agreements (accords, conventions) may set
 * other values; they are not configurable yet. Sources and limits are
 * documented in docs/produit/02-cadre-legal-et-rgpd.md.
 */
export const LABOR_RULES = {
  /** Legal weekly working time: 35 hours (art. L3121-27). */
  legalWeeklyMinutes: 35 * 60,
  /** Default overtime premiums: +25 % for the first 8 hours, +50 % beyond (art. L3121-36). */
  overtimeFirstTierMinutes: 8 * 60,
  /**
   * Paid leave taken during the week counts toward the overtime threshold
   * (Cass. soc., 10 sept. 2025, n° 23-14.455). The ruling does not say how to
   * value a day of leave: a full day is valued at 1/5 of the contractual
   * weekly time, which assumes a five-day week (product choice, to be
   * validated for six-day schedules).
   */
  paidLeaveWorkingDaysPerWeek: 5,
  /** Maximum daily working time: 10 hours (art. L3121-18). */
  maxDailyMinutes: 10 * 60,
  /** Absolute maximum weekly working time: 48 hours (art. L3121-20). */
  maxWeeklyMinutes: 48 * 60,
  /** A break of 20 consecutive minutes is due once daily work reaches 6 hours (art. L3121-16). */
  breakRequiredAfterMinutes: 6 * 60,
  minimumBreakMinutes: 20,
  /** Minimum daily rest: 11 consecutive hours (art. L3131-1). */
  minimumDailyRestMinutes: 11 * 60,
  /** An employee may not work more than 6 days per week (art. L3132-1). */
  maxWorkingDaysPerWeek: 6,
  /**
   * Part-time: complementary hours are limited to 1/10 of the contractual
   * time without an agreement (art. L3123-28) and paid +10 % within that
   * limit (art. L3123-29), +25 % beyond when an agreement allows it.
   */
  complementaryFirstTierRatio: 0.1,
  /** Product rule: an entry open for longer is most likely a forgotten clock-out. */
  forgottenClockOutMinutes: 12 * 60,
} as const;
