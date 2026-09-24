import { addDays, startOfWeek } from '../../core/time/time-format';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Week to show from the "semaine" query parameter, which carries the selected
 * week between the team page and an employee's timesheet: the Monday of that
 * date, or the current week when the parameter is missing, invalid or in the
 * future.
 */
export function weekFromParam(value: string | null, currentWeekStart: string): string {
  // addDays normalises the date: "2026-02-30" is not a calendar day.
  if (!value || !DATE_KEY.test(value) || addDays(value, 0) !== value) {
    return currentWeekStart;
  }
  const monday = startOfWeek(value);
  return monday > currentWeekStart ? currentWeekStart : monday;
}

/** Query parameters of the links: the week only when it is not the current one. */
export function weekQueryParams(
  weekStart: string,
  currentWeekStart: string,
): { semaine: string | null } {
  return { semaine: weekStart === currentWeekStart ? null : weekStart };
}
