import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { KeycloakUser } from '../auth/auth.types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OnboardingService } from './onboarding.service';

interface TransactionMock {
  company: {
    create: jest.Mock;
  };
  user: {
    create: jest.Mock;
    findUnique: jest.Mock;
  };
}

describe('OnboardingService', () => {
  let service: OnboardingService;
  let transaction: TransactionMock;
  let prisma: PrismaService;

  const keycloakUser: KeycloakUser = {
    sub: 'keycloak-subject-1',
    email: 'owner@example.com',
    given_name: 'Alice',
    family_name: 'Martin',
  };

  beforeEach(() => {
    transaction = {
      company: {
        create: jest.fn().mockResolvedValue({
          id: 'company-1',
          name: 'Acme',
          siret: null,
          timezone: 'Europe/Paris',
        }),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'user-1',
          keycloakSubject: keycloakUser.sub,
          email: keycloakUser.email,
          firstName: keycloakUser.given_name,
          lastName: keycloakUser.family_name,
          isActive: true,
          role: UserRole.ADMIN,
        }),
      },
    };

    prisma = {
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    (prisma.$transaction as jest.Mock).mockImplementation(
      (callback: (transaction: TransactionMock) => Promise<unknown>) =>
        callback(transaction),
    );

    service = new OnboardingService(prisma);
  });

  it('creates a company and attaches the authenticated user as ADMIN atomically', async () => {
    const dto: CreateCompanyDto = {
      name: '  Acme  ',
    };

    const result = await service.createCompanyForUser(keycloakUser, dto);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.company.create).toHaveBeenCalledWith({
      data: {
        name: 'Acme',
        siret: null,
        timezone: 'Europe/Paris',
      },
    });
    expect(transaction.user.create).toHaveBeenCalledWith({
      data: {
        keycloakSubject: keycloakUser.sub,
        email: keycloakUser.email,
        firstName: keycloakUser.given_name,
        lastName: keycloakUser.family_name,
        role: UserRole.ADMIN,
        companyId: 'company-1',
      },
    });
    expect(result).toMatchObject({
      role: UserRole.ADMIN,
      subject: keycloakUser.sub,
      company: { id: 'company-1', name: 'Acme' },
    });
  });

  it('rejects a user who already belongs to a company', async () => {
    transaction.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.createCompanyForUser(keycloakUser, { name: 'Another company' }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(transaction.company.create).not.toHaveBeenCalled();
    expect(transaction.user.create).not.toHaveBeenCalled();
  });

  it('validates the company name, SIRET and timezone before opening a transaction', async () => {
    await expect(
      service.createCompanyForUser(keycloakUser, { name: 'A' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.createCompanyForUser(keycloakUser, {
        name: 'Acme',
        siret: '123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.createCompanyForUser(keycloakUser, {
        name: 'Acme',
        timezone: 'Not/A-Timezone',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('only uses the Keycloak subject and never accepts an arbitrary user or company id', async () => {
    const untrustedPayload = {
      name: 'Acme',
      userId: 'other-user',
      companyId: 'other-company',
    } as unknown as CreateCompanyDto;

    await service.createCompanyForUser(keycloakUser, untrustedPayload);

    expect(transaction.user.findUnique).toHaveBeenCalledWith({
      where: { keycloakSubject: keycloakUser.sub },
      select: { id: true },
    });
    expect(transaction.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          keycloakSubject: keycloakUser.sub,
          companyId: 'company-1',
        }),
      }),
    );
    expect(transaction.user.create.mock.calls[0][0].data).not.toHaveProperty(
      'userId',
    );
  });
});
