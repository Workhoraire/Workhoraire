import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ApplicationUser, KeycloakUser } from '../auth/auth.types';
import { MailService } from '../notifications/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInvitationDto } from './dto/create-employee-invitation.dto';
import { EmployeesService } from './employees.service';

interface TransactionMock {
  employeeInvitation: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  user: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  contractPeriod: {
    count: jest.Mock;
    create: jest.Mock;
    findFirst: jest.Mock;
    upsert: jest.Mock;
  };
}

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prisma: PrismaService;
  let transaction: TransactionMock;
  let mail: { send: jest.Mock; enabled: boolean } & MailService;

  const admin = {
    id: 'admin-1',
    companyId: 'company-a',
    role: UserRole.ADMIN,
    firstName: 'Alice',
    lastName: 'Martin',
    company: { id: 'company-a', name: 'Acme', timezone: 'Europe/Paris' },
  } as ApplicationUser;

  /** An employee of the admin's company, hired in January 2026. */
  function storedEmployee(overrides: Record<string, unknown> = {}) {
    return {
      id: 'employee-1',
      role: UserRole.EMPLOYEE,
      isActive: true,
      weeklyContractMinutes: 2100,
      createdAt: new Date('2026-01-07T09:00:00.000Z'),
      ...overrides,
    };
  }

  const keycloakUser: KeycloakUser = {
    sub: 'employee-subject',
    email: 'employee@example.com',
    email_verified: true,
  };

  function configWith(requireVerifiedEmail: string): ConfigService {
    return {
      get: jest.fn((key: string, fallback: string) =>
        key === 'KEYCLOAK_REQUIRE_VERIFIED_EMAIL' ? requireVerifiedEmail : fallback,
      ),
    } as unknown as ConfigService;
  }

  beforeEach(() => {
    mail = { send: jest.fn().mockResolvedValue(true), enabled: true } as unknown as typeof mail;
    transaction = {
      employeeInvitation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      contractPeriod: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        findFirst: jest.fn().mockResolvedValue(null),
        upsert: jest.fn(),
      },
    };

    prisma = {
      company: { findMany: jest.fn().mockResolvedValue([]) },
      contractPeriod: { findMany: jest.fn().mockResolvedValue([]) },
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      employeeInvitation: {
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    (prisma.$transaction as jest.Mock).mockImplementation(
      (callback: (transaction: TransactionMock) => Promise<unknown>) =>
        callback(transaction),
    );

    service = new EmployeesService(prisma, configWith('true'), mail);
  });

  it('lists only employees belonging to the authenticated admin company', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

    await service.listEmployees(admin.companyId);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { companyId: 'company-a' } }),
    );
  });

  it('does not expose or update an employee from another company', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updateEmployee(admin, 'employee-from-company-b', {
        isActive: false,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'employee-from-company-b',
          companyId: 'company-a',
        },
      }),
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('prevents an admin from deactivating or demoting their own account', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(
      storedEmployee({ id: admin.id, role: UserRole.ADMIN }),
    );

    await expect(
      service.updateEmployee(admin, admin.id, { isActive: false }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.updateEmployee(admin, admin.id, { role: UserRole.EMPLOYEE }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('updates employee information, role and status within the admin company', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());
    transaction.user.update.mockResolvedValue({ id: 'employee-1' });
    transaction.contractPeriod.findFirst.mockResolvedValue({ weeklyContractMinutes: 1440 });

    await service.updateEmployee(
      admin,
      'employee-1',
      {
        firstName: 'Jeanne',
        lastName: 'Dupont',
        role: UserRole.MANAGER,
        isActive: false,
        weeklyContractMinutes: 1440,
      },
      new Date('2026-09-23T10:00:00.000Z'),
    );

    expect(transaction.user.update).toHaveBeenCalledWith({
      where: { id: 'employee-1' },
      data: {
        firstName: 'Jeanne',
        lastName: 'Dupont',
        role: UserRole.MANAGER,
        isActive: false,
        weeklyContractMinutes: 1440,
      },
      select: expect.any(Object),
    });
  });

  it('records a contract change from the Monday of the chosen week, keeping past weeks', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());
    transaction.contractPeriod.count.mockResolvedValue(0);
    transaction.contractPeriod.findFirst.mockResolvedValue({ weeklyContractMinutes: 2100 });
    transaction.user.update.mockResolvedValue({ id: 'employee-1' });

    // Change asked on Wednesday 23 September, effective Thursday 1 October 2026.
    await service.updateEmployee(
      admin,
      'employee-1',
      { weeklyContractMinutes: 1680, contractEffectiveFrom: '2026-10-01' },
      new Date('2026-09-23T10:00:00.000Z'),
    );

    // The former contract is kept for the past (history started now)…
    expect(transaction.contractPeriod.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'employee-1', weeklyContractMinutes: 2100 }),
    });
    // …and the new one applies from Monday 28 September.
    expect(transaction.contractPeriod.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_effectiveFrom: {
            userId: 'employee-1',
            effectiveFrom: new Date('2026-09-28T00:00:00.000Z'),
          },
        },
        create: expect.objectContaining({ weeklyContractMinutes: 1680 }),
      }),
    );
    // The contract in force this week is still 35 h.
    expect(transaction.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { weeklyContractMinutes: 2100 } }),
    );
  });

  it('refuses a contract change dated before the week the employee joined', async () => {
    // Hired on Wednesday 7 January 2026: the week of Monday 5 January is the first one.
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());

    await expect(
      service.updateEmployee(
        admin,
        'employee-1',
        { weeklyContractMinutes: 1680, contractEffectiveFrom: '2026-01-04' },
        new Date('2026-09-23T10:00:00.000Z'),
      ),
    ).rejects.toThrow(new BadRequestException('The contract cannot change before the week the employee joined'));
    // Out of the supported years once widened to its Monday: refused the same way, never a 500.
    await expect(
      service.updateEmployee(
        admin,
        'employee-1',
        { weeklyContractMinutes: 1200, contractEffectiveFrom: '2000-01-01' },
        new Date('2026-09-23T10:00:00.000Z'),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();

    transaction.user.update.mockResolvedValue({ id: 'employee-1' });
    await expect(
      service.updateEmployee(
        admin,
        'employee-1',
        { weeklyContractMinutes: 1680, contractEffectiveFrom: '2026-01-05' },
        new Date('2026-09-23T10:00:00.000Z'),
      ),
    ).resolves.toBeDefined();
  });

  it('e-mails the employee about a contract change, with before, after, the week and the author', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());
    // 35 h until then, 28 h from Monday 28 September.
    transaction.contractPeriod.findFirst
      .mockResolvedValueOnce({ weeklyContractMinutes: 2100 })
      .mockResolvedValueOnce({ weeklyContractMinutes: 2100 });
    transaction.user.update.mockResolvedValue({
      id: 'employee-1',
      firstName: 'Paul',
      email: 'paul@example.com',
      isActive: true,
    });

    await service.updateEmployee(
      admin,
      'employee-1',
      { weeklyContractMinutes: 1680, contractEffectiveFrom: '2026-10-01' },
      new Date('2026-09-23T10:00:00.000Z'),
    );

    expect(mail.send).toHaveBeenCalledWith(
      'paul@example.com',
      expect.objectContaining({ subject: 'Votre durée de travail hebdomadaire a été modifiée' }),
    );
    const text = mail.send.mock.calls[0][1].text as string;
    expect(text).toContain('Alice Martin a modifié votre durée de travail hebdomadaire');
    expect(text).toContain('Avant : 35 h par semaine');
    expect(text).toContain('Après : 28 h par semaine');
    expect(text).toContain('À partir de la semaine du 28 septembre 2026');
  });

  it('sends no e-mail when the contract does not change, or for the author’s own contract', async () => {
    transaction.contractPeriod.findFirst.mockResolvedValue({ weeklyContractMinutes: 2100 });
    transaction.user.update.mockResolvedValue({ id: 'employee-1', email: 'paul@example.com', isActive: true });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());
    await service.updateEmployee(admin, 'employee-1', { weeklyContractMinutes: 2100 });

    transaction.user.update.mockResolvedValue({ id: admin.id, email: 'alice@example.com', isActive: true });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee({ id: admin.id, role: UserRole.ADMIN }));
    await service.updateEmployee(admin, admin.id, { weeklyContractMinutes: 1680 });

    expect(mail.send).not.toHaveBeenCalled();
  });

  it('brings the contract in force today up to date once a planned change starts', async () => {
    (prisma.company.findMany as jest.Mock).mockResolvedValue([{ id: 'company-a', timezone: 'Europe/Paris' }]);
    // Latest first: 28 h from 28 September (now in force) over 24 h since the start.
    (prisma.contractPeriod.findMany as jest.Mock).mockResolvedValue([
      { userId: 'employee-1', weeklyContractMinutes: 1680, user: { weeklyContractMinutes: 1440 } },
      { userId: 'employee-1', weeklyContractMinutes: 1440, user: { weeklyContractMinutes: 1440 } },
      { userId: 'employee-2', weeklyContractMinutes: 2100, user: { weeklyContractMinutes: 2100 } },
    ]);

    // Monday 28 September 2026, 00:30 in Paris.
    await expect(service.refreshCurrentContracts(new Date('2026-09-27T22:30:00.000Z'))).resolves.toBe(1);

    expect(prisma.contractPeriod.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { companyId: 'company-a', effectiveFrom: { lte: new Date('2026-09-28T00:00:00.000Z') } },
        orderBy: { effectiveFrom: 'desc' },
      }),
    );
    expect(prisma.user.updateMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: 'employee-1', weeklyContractMinutes: 1440 },
      data: { weeklyContractMinutes: 1680 },
    });
  });

  it('refuses a payroll number already used in the company', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(storedEmployee());
    transaction.user.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.updateEmployee(admin, 'employee-1', { payrollId: 'M001' }),
    ).rejects.toThrow('This payroll number is already used by another employee');
  });

  it('refuses to start in production with the verified email check disabled', () => {
    const productionConfig = {
      get: jest.fn((key: string, fallback?: string) =>
        key === 'KEYCLOAK_REQUIRE_VERIFIED_EMAIL'
          ? 'false'
          : key === 'NODE_ENV'
            ? 'production'
            : fallback,
      ),
    } as unknown as ConfigService;

    expect(() => new EmployeesService(prisma, productionConfig, mail)).toThrow(
      'KEYCLOAK_REQUIRE_VERIFIED_EMAIL=false is only allowed in local development',
    );
  });

  it('creates an invitation with the authenticated company and inviter', async () => {
    transaction.user.findFirst.mockResolvedValue(null);
    transaction.employeeInvitation.updateMany.mockResolvedValue({ count: 0 });
    transaction.employeeInvitation.create.mockResolvedValue({
      id: 'invitation-1',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.EMPLOYEE,
      expiresAt: new Date('2026-09-08T00:00:00.000Z'),
    });

    const dto: CreateEmployeeInvitationDto = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'employee@example.com',
    };
    const result = await service.createInvitation(admin, dto);

    expect(transaction.employeeInvitation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        companyId: 'company-a',
        invitedById: 'admin-1',
        email: 'employee@example.com',
        role: UserRole.EMPLOYEE,
      }),
    });
    expect(
      transaction.employeeInvitation.create.mock.calls[0][0].data.tokenHash,
    ).toHaveLength(64);
    expect(result.token).toHaveLength(43);
    expect(result.replacesPrevious).toBe(false);
    // The personal link is also sent to the invited address.
    expect(mail.send).toHaveBeenCalledWith(
      'employee@example.com',
      expect.objectContaining({
        subject: 'Acme vous invite sur WorkHoraire',
        text: expect.stringContaining(`http://localhost:4200/employee-invitations/${result.token}`),
      }),
    );
    expect(result.emailSent).toBe(true);
  });

  it('replaces a pending invitation for the same email with a new link', async () => {
    transaction.user.findFirst.mockResolvedValue(null);
    transaction.employeeInvitation.updateMany.mockResolvedValue({ count: 1 });
    transaction.employeeInvitation.create.mockResolvedValue({
      id: 'invitation-2',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.EMPLOYEE,
      weeklyContractMinutes: 2100,
      expiresAt: new Date('2026-09-30T00:00:00.000Z'),
    });

    const result = await service.createInvitation(admin, {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'Employee@Example.com',
    });

    // The previous link of the same company expires now: a lost link is never a dead end.
    expect(transaction.employeeInvitation.updateMany).toHaveBeenCalledWith({
      where: {
        companyId: 'company-a',
        email: 'employee@example.com',
        acceptedAt: null,
        expiresAt: { gt: expect.any(Date) },
      },
      data: { expiresAt: expect.any(Date) },
    });
    expect(transaction.employeeInvitation.create).toHaveBeenCalled();
    expect(result.replacesPrevious).toBe(true);
  });

  it('shows who invites the person, but only for a link that can still be used', async () => {
    const findUnique = prisma.employeeInvitation.findUnique as jest.Mock;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = {
      firstName: 'Nora',
      lastName: 'Test',
      email: 'nora@example.com',
      role: UserRole.EMPLOYEE,
      acceptedAt: null,
      expiresAt,
      company: { name: 'Acme' },
    };
    findUnique.mockResolvedValue(invitation);

    await expect(service.getInvitationPreview('a-valid-token')).resolves.toEqual({
      firstName: 'Nora',
      lastName: 'Test',
      email: 'nora@example.com',
      role: UserRole.EMPLOYEE,
      companyName: 'Acme',
      expiresAt,
    });
    // The token is looked up by its hash: it is never stored in clear.
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tokenHash: expect.stringMatching(/^[0-9a-f]{64}$/) } }),
    );

    findUnique.mockResolvedValue({ ...invitation, acceptedAt: new Date() });
    await expect(service.getInvitationPreview('used')).rejects.toBeInstanceOf(ConflictException);
    findUnique.mockResolvedValue({ ...invitation, expiresAt: new Date(Date.now() - 1000) });
    await expect(service.getInvitationPreview('expired')).rejects.toBeInstanceOf(GoneException);
    findUnique.mockResolvedValue(null);
    await expect(service.getInvitationPreview('unknown')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('accepts an invitation only for the matching Keycloak email and company', async () => {
    transaction.employeeInvitation.findUnique.mockResolvedValue({
      id: 'invitation-1',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.MANAGER,
      weeklyContractMinutes: 1440,
      companyId: 'company-a',
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      company: { id: 'company-a', name: 'Acme', timezone: 'Europe/Paris' },
    });
    transaction.employeeInvitation.updateMany.mockResolvedValue({ count: 1 });
    transaction.user.findUnique.mockResolvedValue(null);
    transaction.user.create.mockResolvedValue({
      id: 'employee-1',
      keycloakSubject: keycloakUser.sub,
      email: keycloakUser.email,
      firstName: 'Jean',
      lastName: 'Dupont',
      isActive: true,
      role: UserRole.MANAGER,
      weeklyContractMinutes: 1440,
    });

    const result = await service.acceptInvitation('a-valid-token', keycloakUser);

    expect(transaction.employeeInvitation.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tokenHash: expect.any(String) },
        include: { company: true },
      }),
    );
    expect(transaction.employeeInvitation.updateMany).toHaveBeenCalledWith({
      where: { id: 'invitation-1', acceptedAt: null },
      data: { acceptedAt: expect.any(Date) },
    });
    expect(transaction.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        keycloakSubject: 'employee-subject',
        companyId: 'company-a',
        role: UserRole.MANAGER,
        weeklyContractMinutes: 1440,
        isActive: true,
      }),
    });
    expect(transaction.contractPeriod.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        companyId: 'company-a',
        userId: 'employee-1',
        weeklyContractMinutes: 1440,
      }),
    });
    // The account keeps a link to its invitation (export of the personal data).
    expect(transaction.employeeInvitation.update).toHaveBeenCalledWith({
      where: { id: 'invitation-1' },
      data: { acceptedById: 'employee-1' },
    });
    expect(result.company).toEqual({
      id: 'company-a',
      name: 'Acme',
      timezone: 'Europe/Paris',
    });
    expect(result.weeklyContractMinutes).toBe(1440);
  });

  it('rejects an invitation when another Keycloak email tries to accept it', async () => {
    transaction.employeeInvitation.findUnique.mockResolvedValue({
      id: 'invitation-1',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.EMPLOYEE,
      companyId: 'company-a',
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      company: { id: 'company-a', name: 'Acme' },
    });

    await expect(
      service.acceptInvitation('a-valid-token', {
        sub: 'other-subject',
        email: 'other@example.com',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(transaction.employeeInvitation.updateMany).not.toHaveBeenCalled();
    expect(transaction.user.create).not.toHaveBeenCalled();
  });

  it('requires a verified Keycloak email unless explicitly disabled for local development', async () => {
    const unverified: KeycloakUser = { ...keycloakUser, email_verified: false };

    await expect(service.acceptInvitation('a-valid-token', unverified)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(transaction.employeeInvitation.findUnique).not.toHaveBeenCalled();

    const localService = new EmployeesService(prisma, configWith('false'), mail);
    transaction.employeeInvitation.findUnique.mockResolvedValue(null);
    await expect(localService.acceptInvitation('a-valid-token', unverified)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects accepting an invitation for a Keycloak user already in a company', async () => {
    transaction.employeeInvitation.findUnique.mockResolvedValue({
      id: 'invitation-1',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.EMPLOYEE,
      companyId: 'company-a',
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      company: { id: 'company-a', name: 'Acme' },
    });
    transaction.employeeInvitation.updateMany.mockResolvedValue({ count: 1 });
    transaction.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.acceptInvitation('a-valid-token', keycloakUser),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(transaction.user.create).not.toHaveBeenCalled();
  });
  it('caps the invitations of a company at 100 a day, against mass e-mails', async () => {
    (prisma.employeeInvitation.count as jest.Mock).mockResolvedValue(100);

    await expect(
      service.createInvitation(admin, {
        firstName: 'Nora',
        lastName: 'Durand',
        email: 'nora@example.com',
      }),
    ).rejects.toMatchObject({ status: 429 });
    expect(transaction.employeeInvitation.create).not.toHaveBeenCalled();
  });
  it('closes the pending invitations of an administrator who loses the role', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(
      storedEmployee({ id: 'admin-2', role: UserRole.ADMIN }),
    );
    transaction.user.update.mockResolvedValue({ id: 'admin-2' });
    const now = new Date('2026-09-24T10:00:00.000Z');

    await service.updateEmployee(admin, 'admin-2', { role: UserRole.EMPLOYEE }, now);

    expect(transaction.employeeInvitation.updateMany).toHaveBeenCalledWith({
      where: { invitedById: 'admin-2', acceptedAt: null, expiresAt: { gt: now } },
      data: { expiresAt: now },
    });
  });
});
