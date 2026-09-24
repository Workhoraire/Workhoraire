import { PrismaService } from '../prisma/prisma.service';
import { countActiveEmployees } from './active-employees';

describe('countActiveEmployees', () => {
  function prismaWith(clockedIn: string[], absences: object[]) {
    return {
      timeEntry: { findMany: jest.fn().mockResolvedValue(clockedIn.map((userId) => ({ userId }))) },
      absenceRequest: { findMany: jest.fn().mockResolvedValue(absences) },
    };
  }

  const leave = (userId: string, startDate: string, endDate: string, halfDays = {}) => ({
    userId,
    startDate: new Date(`${startDate}T00:00:00.000Z`),
    endDate: new Date(`${endDate}T00:00:00.000Z`),
    startsAfternoon: false,
    endsMorning: false,
    ...halfDays,
  });

  it('counts the month in the company timezone', async () => {
    const prisma = prismaWith(['a', 'b'], []);

    await expect(
      countActiveEmployees(prisma as unknown as PrismaService, 'company-a', '2026-10', 'Europe/Paris'),
    ).resolves.toBe(2);
    // From 1 October 00:00 (summer time) to 1 November 00:00 (winter time), Paris.
    expect(prisma.timeEntry.findMany.mock.calls[0][0].where.startAt).toEqual({
      gte: new Date('2026-09-30T22:00:00.000Z'),
      lt: new Date('2026-10-31T23:00:00.000Z'),
    });
  });

  it('counts an approved absence only in the months where it covers a working day', async () => {
    // Saturday 31 October to Friday 6 November 2026 (1 November is a Sunday).
    const absences = [leave('seasonal', '2026-10-31', '2026-11-06')];

    await expect(
      countActiveEmployees(prismaWith([], absences) as unknown as PrismaService, 'c', '2026-10', 'Europe/Paris'),
    ).resolves.toBe(0);
    await expect(
      countActiveEmployees(prismaWith([], absences) as unknown as PrismaService, 'c', '2026-11', 'Europe/Paris'),
    ).resolves.toBe(1);
  });

  it('counts each person once, a working half-day included', async () => {
    const absences = [
      leave('a', '2026-10-05', '2026-10-06'),
      // Afternoon of Friday 30 October only: still a working half-day.
      leave('b', '2026-10-30', '2026-11-02', { startsAfternoon: true }),
    ];

    await expect(
      countActiveEmployees(prismaWith(['a'], absences) as unknown as PrismaService, 'c', '2026-10', 'Europe/Paris'),
    ).resolves.toBe(2);
  });
});
