import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import {
  ApplicationUserResponse,
  KeycloakUser,
  toApplicationUserResponse,
} from '../auth/auth.types';
import { initialContractPeriod } from '../employees/contract-periods';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

const DEFAULT_TIMEZONE = 'Europe/Paris';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompanyForUser(
    keycloakUser: KeycloakUser,
    dto: CreateCompanyDto,
  ): Promise<ApplicationUserResponse> {
    const name = dto.name?.trim();
    const siret = dto.siret?.replace(/\s/g, '') || null;
    const timezone = dto.timezone?.trim() || DEFAULT_TIMEZONE;

    this.validateCompanyData(name, siret, timezone);

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const existingUser = await transaction.user.findUnique({
          where: { keycloakSubject: keycloakUser.sub },
          select: { id: true },
        });

        if (existingUser) {
          throw new ConflictException(
            'The Keycloak user is already associated with a company',
          );
        }

        const company = await transaction.company.create({
          data: {
            name,
            siret,
            timezone,
          },
        });

        const user = await transaction.user.create({
          data: {
            keycloakSubject: keycloakUser.sub,
            email: keycloakUser.email ?? null,
            firstName: dto.firstName?.trim() || keycloakUser.given_name || null,
            lastName: dto.lastName?.trim() || keycloakUser.family_name || null,
            role: UserRole.ADMIN,
            companyId: company.id,
          },
        });

        await transaction.contractPeriod.create({
          data: initialContractPeriod(company.id, user.id, user.weeklyContractMinutes),
        });

        return toApplicationUserResponse(user, company);
      });
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = String(error.meta?.['target'] ?? '');
        const message = target.includes('siret')
          ? 'This SIRET is already associated with a company'
          : 'The Keycloak user is already associated with a company';

        throw new ConflictException(message);
      }

      throw error;
    }
  }

  private validateCompanyData(
    name: string | undefined,
    siret: string | null,
    timezone: string,
  ): void {
    if (!name || name.length < 2 || name.length > 120) {
      throw new BadRequestException(
        'Company name must contain between 2 and 120 characters',
      );
    }

    if (siret && !/^\d{14}$/.test(siret)) {
      throw new BadRequestException('SIRET must contain exactly 14 digits');
    }

    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
    } catch {
      throw new BadRequestException('Timezone must be a valid IANA timezone');
    }
  }
}
