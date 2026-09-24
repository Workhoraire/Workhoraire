import { AbsenceStatus } from '@prisma/client';
import { dateKeyToDateColumn, startOfLocalDay } from '../common/dates/local-date';
import { PrismaService } from '../prisma/prisma.service';
import { nextMonthKey } from './pricing';

/**
 * Number of active employees of a month ("YYYY-MM", company timezone): those
 * who clocked in, or had an approved absence, during the month. Seasonal staff
 * are not billed the months they do not work, whatever their account status.
 */
export async function countActiveEmployees(
  prisma: PrismaService,
  companyId: string,
  month: string,
  timezone: string,
): Promise<number> {
  const firstDay = `${month}-01`;
  const nextFirstDay = `${nextMonthKey(month)}-01`;

  const [clockedIn, absent] = await Promise.all([
    prisma.timeEntry.findMany({
      where: {
        companyId,
        startAt: {
          gte: startOfLocalDay(firstDay, timezone),
          lt: startOfLocalDay(nextFirstDay, timezone),
        },
      },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.absenceRequest.findMany({
      where: {
        companyId,
        status: AbsenceStatus.APPROVED,
        startDate: { lt: dateKeyToDateColumn(nextFirstDay) },
        endDate: { gte: dateKeyToDateColumn(firstDay) },
      },
      select: { userId: true },
      distinct: ['userId'],
    }),
  ]);

  return new Set([...clockedIn, ...absent].map((row) => row.userId)).size;
}
