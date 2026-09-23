import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AbsenceStatus, AbsenceType, UserRole } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { AbsencesService, spansOverlap } from './absences.service';

describe('AbsencesService', () => {
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

  let service: AbsencesService;
  let lockQuery: jest.Mock;
  let absenceRequest: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    update: jest.Mock;
  };

  function stored(overrides: Record<string, unknown> = {}) {
    return {
      id: 'absence-1',
      companyId: 'company-a',
      userId: 'employee-1',
      type: AbsenceType.PAID_LEAVE,
      status: AbsenceStatus.PENDING,
      startDate: new Date('2026-10-05T00:00:00.000Z'),
      endDate: new Date('2026-10-09T00:00:00.000Z'),
      startsAfternoon: false,
      endsMorning: false,
      comment: null,
      reviewComment: null,
      reviewedById: null,
      reviewedAt: null,
      createdAt: new Date('2026-09-23T08:00:00.000Z'),
      updatedAt: new Date('2026-09-23T08:00:00.000Z'),
      user: { id: 'employee-1', firstName: 'Jeanne', lastName: 'Dupont' },
      reviewedBy: null,
      ...overrides,
    };
  }

  beforeEach(() => {
    absenceRequest = {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    };
    lockQuery = jest.fn().mockResolvedValue([]);
    const transaction = { absenceRequest, $queryRaw: lockQuery };
    service = new AbsencesService({
      absenceRequest,
      $transaction: jest.fn((callback: (client: unknown) => Promise<unknown>) =>
        callback(transaction),
      ),
    } as unknown as PrismaService);
  });

  it('detects overlaps with half-day precision', () => {
    const morningOnly = {
      startDate: '2026-10-05',
      endDate: '2026-10-05',
      startsAfternoon: false,
      endsMorning: true,
    };
    const afternoonOnly = { ...morningOnly, startsAfternoon: true, endsMorning: false };
    const fullWeek = {
      startDate: '2026-10-05',
      endDate: '2026-10-09',
      startsAfternoon: false,
      endsMorning: false,
    };

    expect(spansOverlap(morningOnly, afternoonOnly)).toBe(false);
    expect(spansOverlap(morningOnly, fullWeek)).toBe(true);
    expect(spansOverlap(afternoonOnly, fullWeek)).toBe(true);
  });

  it('creates a pending request for the authenticated employee and counts working days', async () => {
    absenceRequest.create.mockImplementation(({ data }) => Promise.resolve(stored({ ...data })));

    const result = await service.createRequest(employee, {
      type: AbsenceType.PAID_LEAVE,
      startDate: '2026-10-05',
      endDate: '2026-10-09',
      comment: 'Vacances',
    });

    expect(absenceRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          companyId: 'company-a',
          userId: 'employee-1',
          type: AbsenceType.PAID_LEAVE,
          startDate: new Date('2026-10-05T00:00:00.000Z'),
        }),
      }),
    );
    expect(result).toMatchObject({ status: AbsenceStatus.PENDING, days: 5 });
    // The employee row is locked before the overlap check (concurrent requests).
    expect(lockQuery.mock.invocationCallOrder[0]).toBeLessThan(
      absenceRequest.findMany.mock.invocationCallOrder[0],
    );
  });

  it('rejects requests covering no working day, inverted dates or overlapping another request', async () => {
    await expect(
      service.createRequest(employee, {
        type: AbsenceType.RTT,
        startDate: '2026-10-10',
        endDate: '2026-10-11',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createRequest(employee, {
        type: AbsenceType.RTT,
        startDate: '2026-10-09',
        endDate: '2026-10-05',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    absenceRequest.findMany.mockResolvedValue([stored({ status: AbsenceStatus.APPROVED })]);
    await expect(
      service.createRequest(employee, {
        type: AbsenceType.RTT,
        startDate: '2026-10-07',
        endDate: '2026-10-07',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(absenceRequest.create).not.toHaveBeenCalled();
  });

  it('lets a manager approve a request of the company and records the reviewer', async () => {
    absenceRequest.findFirst.mockResolvedValue(stored());
    absenceRequest.update.mockImplementation(({ data }) => Promise.resolve(stored({ ...data })));
    const now = new Date('2026-09-24T09:00:00.000Z');

    await service.approveRequest(manager, 'absence-1', { comment: 'Bonnes vacances' }, now);

    expect(absenceRequest.findFirst).toHaveBeenCalledWith({
      where: { id: 'absence-1', companyId: 'company-a' },
    });
    expect(absenceRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'absence-1', status: AbsenceStatus.PENDING },
        data: {
          status: AbsenceStatus.APPROVED,
          reviewComment: 'Bonnes vacances',
          reviewedById: 'manager-1',
          reviewedAt: now,
        },
      }),
    );
  });

  it('refuses to approve a request overlapping an absence already approved', async () => {
    absenceRequest.findFirst.mockResolvedValue(stored());
    absenceRequest.findMany.mockResolvedValue([
      stored({ id: 'absence-2', status: AbsenceStatus.APPROVED }),
    ]);

    await expect(service.approveRequest(admin, 'absence-1', {})).rejects.toThrow(
      'This period overlaps another absence request',
    );
    expect(absenceRequest.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        userId: 'employee-1',
        id: { not: 'absence-1' },
        status: { in: [AbsenceStatus.APPROVED] },
      }),
    });
    expect(absenceRequest.update).not.toHaveBeenCalled();
  });

  it('lets a manager revoke an approved absence with a reason, except their own', async () => {
    const now = new Date('2026-10-08T09:00:00.000Z');
    absenceRequest.findFirst.mockResolvedValue(stored({ status: AbsenceStatus.APPROVED }));
    absenceRequest.update.mockImplementation(({ data }) => Promise.resolve(stored({ ...data })));

    await expect(
      service.revokeRequest(manager, 'absence-1', { comment: 'Retour anticipé jeudi' }, now),
    ).resolves.toMatchObject({ status: AbsenceStatus.CANCELLED });
    expect(absenceRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'absence-1', status: AbsenceStatus.APPROVED },
        data: {
          status: AbsenceStatus.CANCELLED,
          reviewComment: 'Retour anticipé jeudi',
          reviewedById: 'manager-1',
          reviewedAt: now,
        },
      }),
    );

    absenceRequest.findFirst.mockResolvedValue(stored({ userId: 'manager-1' }));
    await expect(
      service.revokeRequest(manager, 'absence-1', { comment: 'Moi-même' }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    absenceRequest.findFirst.mockResolvedValue(stored({ status: AbsenceStatus.CANCELLED }));
    await expect(
      service.revokeRequest(admin, 'absence-1', { comment: 'Déjà annulée' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('forbids a manager from reviewing their own request, but not an administrator', async () => {
    absenceRequest.findFirst.mockResolvedValue(stored({ userId: 'manager-1' }));
    await expect(service.approveRequest(manager, 'absence-1', {})).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    absenceRequest.findFirst.mockResolvedValue(stored({ userId: 'admin-1' }));
    absenceRequest.update.mockImplementation(({ data }) => Promise.resolve(stored({ ...data })));
    await expect(service.approveRequest(admin, 'absence-1', {})).resolves.toBeDefined();
  });

  it('refuses to review a request twice or from another company', async () => {
    absenceRequest.findFirst.mockResolvedValue(stored({ status: AbsenceStatus.REJECTED }));
    await expect(service.approveRequest(admin, 'absence-1', {})).rejects.toBeInstanceOf(
      ConflictException,
    );

    absenceRequest.findFirst.mockResolvedValue(null);
    await expect(service.rejectRequest(admin, 'absence-x', {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(absenceRequest.update).not.toHaveBeenCalled();
  });

  it('lets an employee cancel a pending request or a future approved one only', async () => {
    const now = new Date('2026-10-06T08:00:00.000Z');
    absenceRequest.update.mockImplementation(({ data }) => Promise.resolve(stored({ ...data })));

    absenceRequest.findFirst.mockResolvedValue(stored());
    await expect(service.cancelOwnRequest(employee, 'absence-1', now)).resolves.toMatchObject({
      status: AbsenceStatus.CANCELLED,
    });
    // The employee is recorded as the author of the last decision.
    expect(absenceRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          status: AbsenceStatus.CANCELLED,
          reviewComment: null,
          reviewedById: 'employee-1',
          reviewedAt: now,
        },
      }),
    );

    absenceRequest.findFirst.mockResolvedValue(stored({ status: AbsenceStatus.APPROVED }));
    await expect(service.cancelOwnRequest(employee, 'absence-1', now)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(absenceRequest.findFirst).toHaveBeenCalledWith({
      where: { id: 'absence-1', companyId: 'company-a', userId: 'employee-1' },
    });
  });
});
