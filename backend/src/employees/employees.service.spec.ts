import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ApplicationUser, KeycloakUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInvitationDto } from './dto/create-employee-invitation.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

interface TransactionMock {
  employeeInvitation: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    updateMany: jest.Mock;
  };
  user: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
  };
}

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prisma: PrismaService;
  let transaction: TransactionMock;

  const admin = {
    id: 'admin-1',
    companyId: 'company-a',
    role: UserRole.ADMIN,
  } as ApplicationUser;

  const keycloakUser: KeycloakUser = {
    sub: 'employee-subject',
    email: 'employee@example.com',
  };

  beforeEach(() => {
    transaction = {
      employeeInvitation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    prisma = {
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    (prisma.$transaction as jest.Mock).mockImplementation(
      (callback: (transaction: TransactionMock) => Promise<unknown>) =>
        callback(transaction),
    );

    service = new EmployeesService(prisma);
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
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: admin.id,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await expect(
      service.updateEmployee(admin, admin.id, { isActive: false }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.updateEmployee(admin, admin.id, { role: UserRole.EMPLOYEE }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('updates employee information, role and status within the admin company', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'employee-1',
      role: UserRole.EMPLOYEE,
      isActive: true,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'employee-1',
      firstName: 'Jeanne',
      lastName: 'Dupont',
      email: 'jeanne@example.com',
      isActive: false,
      role: UserRole.MANAGER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.updateEmployee(admin, 'employee-1', {
      firstName: 'Jeanne',
      lastName: 'Dupont',
      email: 'jeanne@example.com',
      role: UserRole.MANAGER,
      isActive: false,
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'employee-1' },
      data: {
        firstName: 'Jeanne',
        lastName: 'Dupont',
        email: 'jeanne@example.com',
        role: UserRole.MANAGER,
        isActive: false,
      },
      select: expect.any(Object),
    });
  });

  it('creates an invitation with the authenticated company and inviter', async () => {
    transaction.user.findFirst.mockResolvedValue(null);
    transaction.employeeInvitation.findFirst.mockResolvedValue(null);
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
  });

  it('accepts an invitation only for the matching Keycloak email and company', async () => {
    transaction.employeeInvitation.findUnique.mockResolvedValue({
      id: 'invitation-1',
      email: 'employee@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.MANAGER,
      companyId: 'company-a',
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      company: { id: 'company-a', name: 'Acme' },
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
        isActive: true,
      }),
    });
    expect(result.company).toEqual({ id: 'company-a', name: 'Acme' });
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
});
