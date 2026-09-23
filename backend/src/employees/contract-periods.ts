import { Prisma } from '@prisma/client';
import { dateKeyToDateColumn } from '../common/dates/local-date';

/**
 * Monday used as the start of every employee's contract history: weeks before
 * the first recorded change use the contract the employee started with.
 */
export const CONTRACT_HISTORY_START = '2000-01-03';

/** Initial contract of a new employee, valid for every past week. */
export function initialContractPeriod(
  companyId: string,
  userId: string,
  weeklyContractMinutes: number,
): Prisma.ContractPeriodUncheckedCreateInput {
  return {
    companyId,
    userId,
    effectiveFrom: dateKeyToDateColumn(CONTRACT_HISTORY_START),
    weeklyContractMinutes,
  };
}
