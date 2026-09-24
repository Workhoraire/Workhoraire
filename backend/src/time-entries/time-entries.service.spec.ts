import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TimeEntryAuditAction, TimeEntrySource, UserRole } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notifications/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TimesheetsService } from '../timesheets/timesheets.service';
import { TimeEntriesService } from './time-entries.service';

interface TimeEntryDelegateMock {
  create: jest.Mock;
  delete: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
}

describe('TimeEntriesService', () => {
  const now = new Date('2026-09-23T16:00:00.000Z');
  const company = { id: 'company-a', name: 'Acme', timezone: 'Europe/Paris' };

  const employee = {
    id: 'employee-1',
    companyId: 'company-a',
    role: UserRole.EMPLOYEE,
    company,
  } as ApplicationUser;
  const manager = {
    id: 'manager-1',
    companyId: 'company-a',
    role: UserRole.MANAGER,
    company,
  } as ApplicationUser;
  const admin = {
    id: 'admin-1',
    companyId: 'company-a',
    role: UserRole.ADMIN,
    company,
  } as ApplicationUser;

  let service: TimeEntriesService;
  let timeEntry: TimeEntryDelegateMock;
  let auditCreate: jest.Mock;
  let auditFindMany: jest.Mock;
  let userFindFirst: jest.Mock;
  let lockQuery: jest.Mock;
  let mail: { send: jest.Mock; enabled: boolean };

  function storedEntry(overrides: Record<string, unknown> = {}) {
    return {
      id: 'entry-1',
      companyId: 'company-a',
      userId: 'employee-1',
      startAt: new Date('2026-09-23T06:00:00.000Z'),
      endAt: null,
      openUserId: 'employee-1',
      source: TimeEntrySource.CLOCK,
      note: null,
      createdById: 'employee-1',
      createdAt: new Date('2026-09-23T06:00:00.000Z'),
      updatedAt: new Date('2026-09-23T06:00:00.000Z'),
      ...overrides,
    };
  }

  beforeEach(() => {
    timeEntry = {
      create: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    };
    auditCreate = jest.fn();
    auditFindMany = jest.fn().mockResolvedValue([]);
    userFindFirst = jest.fn();
    lockQuery = jest.fn().mockResolvedValue([]);

    const transaction = {
      timeEntry,
      timeEntryAuditLog: { create: auditCreate },
      $queryRaw: lockQuery,
    };
    const prisma = {
      timeEntry,
      timeEntryAuditLog: { create: auditCreate, findMany: auditFindMany },
      user: { findFirst: userFindFirst },
      $transaction: jest.fn((callback: (client: unknown) => Promise<unknown>) =>
        callback(transaction),
      ),
    } as unknown as PrismaService;

    // E-mails off by default: one test below turns them on.
    mail = { send: jest.fn().mockResolvedValue(true), enabled: false };
    service = new TimeEntriesService(
      prisma,
      {} as TimesheetsService,
      mail as unknown as MailService,
      { get: (_key: string, fallback: string) => fallback } as unknown as ConfigService,
    );
  });

  describe('clocking', () => {
    it('clocks in with the server time, the authenticated company and a single-open marker', async () => {
      timeEntry.create.mockImplementation(({ data }) => Promise.resolve(storedEntry({ ...data })));

      const result = await service.clockIn(employee, { note: 'Ouverture' }, now);

      expect(timeEntry.create).toHaveBeenCalledWith({
        data: {
          companyId: 'company-a',
          userId: 'employee-1',
          startAt: now,
          openUserId: 'employee-1',
          source: TimeEntrySource.CLOCK,
          note: 'Ouverture',
          createdById: 'employee-1',
        },
      });
      expect(result).toMatchObject({ isOpen: true, durationMinutes: 0 });
    });

    it('refuses a second clock-in while an entry is open', async () => {
      timeEntry.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(service.clockIn(employee, {}, now)).rejects.toBeInstanceOf(ConflictException);
    });

    it('clocks out the open entry of the authenticated employee only', async () => {
      timeEntry.findUnique.mockResolvedValue(storedEntry());
      timeEntry.update.mockImplementation(({ data }) =>
        Promise.resolve(storedEntry({ ...data })),
      );

      const result = await service.clockOut(employee, {}, now);

      expect(timeEntry.findUnique).toHaveBeenCalledWith({ where: { openUserId: 'employee-1' } });
      expect(timeEntry.update).toHaveBeenCalledWith({
        where: { id: 'entry-1', openUserId: 'employee-1' },
        data: { endAt: now, openUserId: null, note: null },
      });
      expect(result).toMatchObject({ isOpen: false, durationMinutes: 600 });
    });

    it('asks to declare the end time instead of clocking out an entry open for over 12 hours', async () => {
      // Opened at 03:00 UTC, clock-out at 16:00 UTC: 13 hours, most likely a forgotten exit.
      timeEntry.findUnique.mockResolvedValue(
        storedEntry({ startAt: new Date('2026-09-23T03:00:00.000Z') }),
      );

      await expect(service.clockOut(employee, {}, now)).rejects.toThrow(
        'This entry has been open for more than 12 hours: declare its end time',
      );
      expect(timeEntry.update).not.toHaveBeenCalled();
    });

    it('refuses to clock out when no entry is open', async () => {
      timeEntry.findUnique.mockResolvedValue(null);

      await expect(service.clockOut(employee, {}, now)).rejects.toBeInstanceOf(ConflictException);
      expect(timeEntry.update).not.toHaveBeenCalled();
    });

    it('reminds a forgotten clock-out once, and again at the next run if the e-mail was not delivered', async () => {
      mail.enabled = true;
      const forgotten = {
        id: 'entry-1',
        startAt: new Date('2026-09-23T03:00:00.000Z'),
        user: { email: 'emma@example.com', firstName: 'Emma', isActive: true },
        company: { timezone: 'Europe/Paris' },
      };
      timeEntry.findMany.mockResolvedValue([forgotten]);
      mail.send.mockResolvedValueOnce(false);

      await expect(service.remindForgottenClockOuts(now)).resolves.toBe(0);
      // Claimed before sending, released when the e-mail did not leave.
      expect(timeEntry.updateMany).toHaveBeenNthCalledWith(1, {
        where: { id: 'entry-1', reminderSentAt: null, endAt: null },
        data: { reminderSentAt: now },
      });
      expect(timeEntry.updateMany).toHaveBeenNthCalledWith(2, {
        where: { id: 'entry-1', reminderSentAt: now },
        data: { reminderSentAt: null },
      });

      timeEntry.updateMany.mockClear();
      await expect(service.remindForgottenClockOuts(now)).resolves.toBe(1);
      expect(timeEntry.updateMany).toHaveBeenCalledTimes(1);
      expect(mail.send).toHaveBeenLastCalledWith(
        'emma@example.com',
        expect.objectContaining({ subject: 'Sortie non pointée le mercredi 23 septembre' }),
      );
    });

    it('lets an employee close a forgotten entry with a reason, and audits it', async () => {
      timeEntry.findUnique.mockResolvedValue(storedEntry());
      timeEntry.update.mockImplementation(({ data }) =>
        Promise.resolve(storedEntry({ ...data })),
      );

      await service.closeOwnOpenEntry(
        employee,
        { endAt: '2026-09-23T15:30:00.000Z', reason: 'Oubli de pointage' },
        now,
      );

      expect(auditCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId: 'company-a',
          employeeId: 'employee-1',
          actorId: 'employee-1',
          action: TimeEntryAuditAction.UPDATED,
          reason: 'Oubli de pointage',
          before: expect.objectContaining({ endAt: null }),
          after: expect.objectContaining({ endAt: '2026-09-23T15:30:00.000Z' }),
        }),
      });
    });

    it('rejects a declared end time in the future, before the start or beyond 24 hours', async () => {
      timeEntry.findUnique.mockResolvedValue(storedEntry());

      for (const endAt of [
        '2026-09-23T17:00:00.000Z',
        '2026-09-23T05:00:00.000Z',
      ]) {
        await expect(
          service.closeOwnOpenEntry(employee, { endAt, reason: 'Oubli' }, now),
        ).rejects.toBeInstanceOf(BadRequestException);
      }

      timeEntry.findUnique.mockResolvedValue(
        storedEntry({ startAt: new Date('2026-09-21T06:00:00.000Z') }),
      );
      await expect(
        service.closeOwnOpenEntry(
          employee,
          { endAt: '2026-09-23T15:00:00.000Z', reason: 'Oubli' },
          now,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(timeEntry.update).not.toHaveBeenCalled();
    });
  });

  describe('manual corrections', () => {
    const dto = {
      userId: 'employee-1',
      startAt: '2026-09-22T07:00:00.000Z',
      endAt: '2026-09-22T11:00:00.000Z',
      reason: 'Badge oublié',
    };

    it('creates a manual entry for an employee of the same company and audits it', async () => {
      userFindFirst.mockResolvedValue({ id: 'employee-1' });
      timeEntry.findFirst.mockResolvedValue(null);
      timeEntry.create.mockImplementation(({ data }) => Promise.resolve(storedEntry({ ...data })));

      await service.createEntry(manager, dto, now);

      expect(userFindFirst).toHaveBeenCalledWith({
        where: { id: 'employee-1', companyId: 'company-a' },
        select: { id: true },
      });
      expect(timeEntry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId: 'company-a',
          userId: 'employee-1',
          source: TimeEntrySource.MANUAL,
          createdById: 'manager-1',
        }),
      });
      // The employee row is locked before the overlap check (concurrent corrections).
      expect(lockQuery).toHaveBeenCalled();
      expect(lockQuery.mock.invocationCallOrder[0]).toBeLessThan(
        timeEntry.findFirst.mock.invocationCallOrder[0],
      );
      expect(auditCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: TimeEntryAuditAction.CREATED,
          actorId: 'manager-1',
          reason: 'Badge oublié',
          before: Prisma.DbNull,
        }),
      });
    });

    it('does not reach an employee of another company', async () => {
      userFindFirst.mockResolvedValue(null);

      await expect(
        service.createEntry(manager, { ...dto, userId: 'employee-of-company-b' }, now),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(timeEntry.create).not.toHaveBeenCalled();
    });

    it('refuses overlapping entries', async () => {
      userFindFirst.mockResolvedValue({ id: 'employee-1' });
      timeEntry.findFirst.mockResolvedValue({ id: 'other-entry' });

      await expect(service.createEntry(manager, dto, now)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(timeEntry.create).not.toHaveBeenCalled();
    });

    it('forbids a manager from correcting their own hours, but allows an administrator', async () => {
      await expect(
        service.createEntry(manager, { ...dto, userId: 'manager-1' }, now),
      ).rejects.toBeInstanceOf(ForbiddenException);

      userFindFirst.mockResolvedValue({ id: 'admin-1' });
      timeEntry.findFirst.mockResolvedValue(null);
      timeEntry.create.mockImplementation(({ data }) => Promise.resolve(storedEntry({ ...data })));

      await expect(
        service.createEntry(admin, { ...dto, userId: 'admin-1' }, now),
      ).resolves.toBeDefined();
    });

    it('tells the employee by e-mail about a correction, with the reason', async () => {
      mail.enabled = true;
      const closed = storedEntry({
        endAt: new Date('2026-09-22T10:00:00.000Z'),
        openUserId: null,
        startAt: new Date('2026-09-22T06:00:00.000Z'),
      });
      timeEntry.findFirst.mockResolvedValueOnce(closed).mockResolvedValueOnce(null);
      timeEntry.update.mockImplementation(({ data }) => Promise.resolve({ ...closed, ...data }));
      userFindFirst.mockResolvedValue({ email: 'emma@example.com', firstName: 'Emma', isActive: true });

      await service.updateEntry(
        { ...manager, firstName: 'Karim', lastName: 'Benali' } as ApplicationUser,
        'entry-1',
        { endAt: '2026-09-22T10:30:00.000Z', reason: 'Livraison tardive' },
        now,
      );
      // The e-mail leaves after the correction is saved, without delaying it.
      await new Promise((resolve) => setImmediate(resolve));

      expect(mail.send).toHaveBeenCalledWith(
        'emma@example.com',
        expect.objectContaining({
          subject: 'Vos heures du mardi 22 septembre ont été corrigées',
          text: expect.stringContaining('Avant : 08:00 – 12:00'),
        }),
      );
      expect(mail.send.mock.calls[0][1].text).toContain('Après : 08:00 – 12:30');
      expect(mail.send.mock.calls[0][1].text).toContain('Motif : « Livraison tardive »');
    });

    it('updates an entry of the company with a before/after snapshot', async () => {
      const closed = storedEntry({
        endAt: new Date('2026-09-22T11:00:00.000Z'),
        openUserId: null,
        startAt: new Date('2026-09-22T07:00:00.000Z'),
      });
      timeEntry.findFirst
        .mockResolvedValueOnce(closed) // tenant-scoped lookup
        .mockResolvedValueOnce(null); // overlap check
      timeEntry.update.mockImplementation(({ data }) => Promise.resolve({ ...closed, ...data }));

      await service.updateEntry(
        manager,
        'entry-1',
        { endAt: '2026-09-22T12:00:00.000Z', reason: 'Heure de sortie erronée' },
        now,
      );

      expect(timeEntry.findFirst).toHaveBeenNthCalledWith(1, {
        where: { id: 'entry-1', companyId: 'company-a' },
      });
      // Optimistic lock: only the version that was checked is updated.
      expect(timeEntry.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'entry-1', updatedAt: closed.updatedAt } }),
      );
      expect(auditCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: TimeEntryAuditAction.UPDATED,
          before: expect.objectContaining({ endAt: '2026-09-22T11:00:00.000Z' }),
          after: expect.objectContaining({ endAt: '2026-09-22T12:00:00.000Z' }),
        }),
      });
    });

    it('deletes an entry but keeps its audit trail', async () => {
      const closed = storedEntry({ endAt: new Date('2026-09-22T11:00:00.000Z'), openUserId: null });
      timeEntry.findFirst.mockResolvedValue(closed);

      await service.deleteEntry(admin, 'entry-1', { reason: 'Doublon' });

      expect(timeEntry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-1', updatedAt: closed.updatedAt },
      });
      expect(auditCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: TimeEntryAuditAction.DELETED,
          timeEntryId: 'entry-1',
          reason: 'Doublon',
          after: Prisma.DbNull,
        }),
      });
    });

    it('refuses to move an entry to another day, which would hide its trail', async () => {
      timeEntry.findFirst.mockResolvedValue(
        storedEntry({
          startAt: new Date('2026-09-21T06:00:00.000Z'),
          endAt: new Date('2026-09-21T10:00:00.000Z'),
          openUserId: null,
        }),
      );

      await expect(
        service.updateEntry(
          manager,
          'entry-1',
          {
            startAt: '2026-06-01T06:00:00.000Z',
            endAt: '2026-06-01T10:00:00.000Z',
            reason: 'Déplacement',
          },
          now,
        ),
      ).rejects.toThrow('An entry cannot be moved to another day: delete it and create a new one');
      expect(timeEntry.update).not.toHaveBeenCalled();
    });

    it('bounds the start of an open entry to the last 24 hours', async () => {
      timeEntry.findFirst.mockResolvedValue(storedEntry());

      await expect(
        service.updateEntry(
          manager,
          'entry-1',
          { startAt: '2026-09-23T00:30:00+02:00', reason: 'Arrivée plus tôt' },
          new Date('2026-09-24T01:00:00+02:00'),
        ),
      ).rejects.toThrow('An entry cannot last more than 24 hours');
    });

    it('turns a concurrent change or deletion into a 409 instead of a 500', async () => {
      const closed = storedEntry({ endAt: new Date('2026-09-22T11:00:00.000Z'), openUserId: null });
      timeEntry.findFirst.mockResolvedValue(closed);
      timeEntry.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'test',
        }),
      );

      await expect(service.deleteEntry(admin, 'entry-1', { reason: 'Doublon' })).rejects.toThrow(
        'This time entry has changed, reload it and retry',
      );
    });

    it('returns 404 for an entry of another company', async () => {
      timeEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteEntry(admin, 'entry-of-company-b', { reason: 'Test' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(timeEntry.delete).not.toHaveBeenCalled();
    });
  });

  it('restricts the audit trail of an employee to their own entries', async () => {
    await service.listAuditLogs(employee, {
      from: '2026-09-21',
      to: '2026-09-27',
      employeeId: 'someone-else',
    });

    expect(auditFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ companyId: 'company-a', employeeId: 'employee-1' }),
      }),
    );
  });
});
