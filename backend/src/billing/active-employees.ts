import { AbsenceStatus } from '@prisma/client';
import {
  addDays,
  dateColumnToKey,
  dateKeyToDateColumn,
  eachDateKey,
  startOfLocalDay,
} from '../common/dates/local-date';
import { PrismaService } from '../prisma/prisma.service';
import { absencePortion } from '../timesheets/timesheet.calculator';
import { nextMonthKey } from './pricing';

/**
 * Number of active employees of a month ("YYYY-MM", company timezone): those
 * who clocked in, or had an approved absence on a working day, during the
 * month. Seasonal staff are not billed the months they do not work, whatever
 * their account status.
 */
export async function countActiveEmployees(
  prisma: PrismaService,
  companyId: string,
  month: string,
  timezone: string,
): Promise<number> {
  const firstDay = `${month}-01`;
  const nextFirstDay = `${nextMonthKey(month)}-01`;
  const lastDay = addDays(nextFirstDay, -1);

  const [clockedIn, absences] = await Promise.all([
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
      select: { userId: true, startDate: true, endDate: true, startsAfternoon: true, endsMorning: true },
    }),
  ]);

  const active = new Set(clockedIn.map((row) => row.userId));
  for (const request of absences) {
    const absence = {
      id: '',
      type: 'OTHER' as const,
      startDate: dateColumnToKey(request.startDate),
      endDate: dateColumnToKey(request.endDate),
      startsAfternoon: request.startsAfternoon,
      endsMorning: request.endsMorning,
    };
    // A leave that only covers a weekend or a public holiday of the month does not count.
    const from = absence.startDate > firstDay ? absence.startDate : firstDay;
    const to = absence.endDate < lastDay ? absence.endDate : lastDay;
    if (eachDateKey(from, to).some((day) => absencePortion(absence, day) > 0)) {
      active.add(request.userId);
    }
  }
  return active.size;
}
