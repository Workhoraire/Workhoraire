import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AbsenceStatus, TimeEntrySource, UserRole } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { TimesheetsService } from './timesheets.service';

describe('TimesheetsService', () => {
  const manager = {
    id: 'manager-1',
    companyId: 'company-a',
    role: UserRole.MANAGER,
    firstName: 'Paul',
    lastName: 'Martin',
    email: 'paul@example.com',
    isActive: true,
    weeklyContractMinutes: 2100,
    company: { id: 'company-a', name: 'Acme', timezone: 'Europe/Paris' },
  } as ApplicationUser;

  let service: TimesheetsService;
  let prisma: {
    user: { findFirst: jest.Mock; findMany: jest.Mock };
    timeEntry: { findMany: jest.Mock };
    absenceRequest: { findMany: jest.Mock };
    timeEntryAuditLog: { findMany: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      user: { findFirst: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
      timeEntry: { findMany: jest.fn().mockResolvedValue([]) },
      absenceRequest: { findMany: jest.fn().mockResolvedValue([]) },
      timeEntryAuditLog: { findMany: jest.fn().mockResolvedValue([]) },
    };
    service = new TimesheetsService(prisma as unknown as PrismaService);
  });

  it('scopes every query of the own timesheet to the company and the user', async () => {
    await service.getOwnTimesheet(manager, '2026-09-21', '2026-09-27');

    expect(prisma.timeEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ companyId: 'company-a', userId: 'manager-1' }),
      }),
    );
    expect(prisma.absenceRequest.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        companyId: 'company-a',
        userId: 'manager-1',
        status: AbsenceStatus.APPROVED,
      }),
    });
  });

  it('loads the previous day to check the daily rest of the first day', async () => {
    await service.getOwnTimesheet(manager, '2026-09-21', '2026-09-27');

    const where = prisma.timeEntry.findMany.mock.calls[0][0].where;
    // Sunday 20 September 2026 at midnight in Paris.
    expect(where.startAt.gte.toISOString()).toBe('2026-09-19T22:00:00.000Z');
    expect(where.startAt.lt.toISOString()).toBe('2026-09-27T22:00:00.000Z');
  });

  it('marks entries that have an audit trail as corrected', async () => {
    prisma.timeEntry.findMany.mockResolvedValue([
      {
        id: 'entry-1',
        userId: 'manager-1',
        startAt: new Date('2026-09-22T07:00:00.000Z'),
        endAt: new Date('2026-09-22T11:00:00.000Z'),
        source: TimeEntrySource.CLOCK,
        note: null,
      },
    ]);
    prisma.timeEntryAuditLog.findMany.mockResolvedValue([{ timeEntryId: 'entry-1' }]);

    const timesheet = await service.getOwnTimesheet(manager, '2026-09-21', '2026-09-27');

    expect(timesheet.days[1].entries[0]).toMatchObject({ id: 'entry-1', isCorrected: true });
    expect(timesheet.days[1].workedMinutes).toBe(240);
  });

  it('does not expose the timesheet of an employee of another company', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.getEmployeeTimesheet(manager, 'employee-of-company-b', '2026-09-21', '2026-09-27'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'employee-of-company-b', companyId: 'company-a' } }),
    );
    expect(prisma.timeEntry.findMany).not.toHaveBeenCalled();
  });

  it('builds the team timesheet from the company employees only', async () => {
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'employee-1',
        firstName: 'Jeanne',
        lastName: 'Dupont',
        email: null,
        role: UserRole.EMPLOYEE,
        isActive: true,
        weeklyContractMinutes: 2100,
      },
    ]);

    const team = await service.getTeamTimesheet(manager, '2026-11-09', '2026-11-15');

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ companyId: 'company-a' }) }),
    );
    expect(team.rows).toHaveLength(1);
    expect(team.rows[0].days).toHaveLength(7);
    expect(team.publicHolidays).toEqual([{ date: '2026-11-11', name: 'Armistice 1918' }]);
  });

  it('rejects invalid or too long periods', async () => {
    await expect(
      service.getOwnTimesheet(manager, '2026-09-27', '2026-09-21'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.getOwnTimesheet(manager, '2026-01-01', '2026-12-31'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.getOwnTimesheet(manager, '2026-02-30', '2026-03-02'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
