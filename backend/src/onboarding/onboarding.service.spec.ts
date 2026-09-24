import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { KeycloakUser } from '../auth/auth.types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OnboardingService } from './onboarding.service';
import { CURRENT_TERMS_VERSION } from './terms';

interface TransactionMock {
  company: {
    create: jest.Mock;
  };
  user: {
    create: jest.Mock;
    findUnique: jest.Mock;
  };
  contractPeriod: {
    create: jest.Mock;
  };
}

describe('OnboardingService', () => {
  let service: OnboardingService;
  let transaction: TransactionMock;
  let prisma: PrismaService;

  const keycloakUser: KeycloakUser = {
    sub: 'keycloak-subject-1',
    email: 'owner@example.com',
    email_verified: true,
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
          weeklyContractMinutes: 2100,
        }),
      },
      contractPeriod: {
        create: jest.fn(),
      },
    };

    prisma = {
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    (prisma.$transaction as jest.Mock).mockImplementation(
      (callback: (transaction: TransactionMock) => Promise<unknown>) =>
        callback(transaction),
    );

    service = new OnboardingService(prisma, new ConfigService({ KEYCLOAK_REQUIRE_VERIFIED_EMAIL: 'true' }));
  });

  it('creates a company and attaches the authenticated user as ADMIN atomically', async () => {
    const dto: CreateCompanyDto = {
      name: '  Acme  ',
      acceptTerms: true,
    };

    const result = await service.createCompanyForUser(keycloakUser, dto);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.company.create).toHaveBeenCalledWith({
      data: {
        name: 'Acme',
        siret: null,
        timezone: 'Europe/Paris',
        // Proof of the acceptance of the terms of sale and of the processing agreement.
        termsAcceptedAt: expect.any(Date),
        termsVersion: CURRENT_TERMS_VERSION,
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
    // The administrator starts with a contract history like every employee.
    expect(transaction.contractPeriod.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ companyId: 'company-1', userId: 'user-1' }),
    });
  });

  it('uses the name typed in the form, the sign-up page no longer asking for it', async () => {
    await service.createCompanyForUser(
      { sub: 'new-admin', email: 'claire@example.com', email_verified: true },
      { name: 'Atelier Durand', firstName: ' Claire ', lastName: 'Durand', acceptTerms: true },
    );

    expect(transaction.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ firstName: 'Claire', lastName: 'Durand' }),
    });
  });

  it('rejects a user who already belongs to a company', async () => {
    transaction.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.createCompanyForUser(keycloakUser, { name: 'Another company', acceptTerms: true }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(transaction.company.create).not.toHaveBeenCalled();
    expect(transaction.user.create).not.toHaveBeenCalled();
  });

  it('validates the company name, SIRET and timezone before opening a transaction', async () => {
    await expect(
      service.createCompanyForUser(keycloakUser, { name: 'A', acceptTerms: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.createCompanyForUser(keycloakUser, {
        name: 'Acme',
        siret: '123',
        acceptTerms: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.createCompanyForUser(keycloakUser, {
        name: 'Acme',
        timezone: 'Not/A-Timezone',
        acceptTerms: true,
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
  it('refuses to create a company with an unverified e-mail address', async () => {
    await expect(
      service.createCompanyForUser(
        { sub: 'unverified', email: 'dg@example.com', email_verified: false },
        { name: 'Acme', acceptTerms: true },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
