import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import {
  ApplicationUser,
  ApplicationUserResponse,
  KeycloakUser,
  toApplicationUserResponse,
} from '../auth/auth.types';
import {
  dateKeyToDateColumn,
  isValidDateKey,
  startOfWeek,
  toDateKey,
} from '../common/dates/local-date';
import { PrismaService } from '../prisma/prisma.service';
import { CONTRACT_HISTORY_START, initialContractPeriod } from './contract-periods';
import { CreateEmployeeInvitationDto } from './dto/create-employee-invitation.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  EmployeeInvitationPreview,
  EmployeeInvitationResponse,
  EmployeeResponse,
} from './employee.types';

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_WEEKLY_CONTRACT_MINUTES = 35 * 60;

const employeeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isActive: true,
  role: true,
  weeklyContractMinutes: true,
  payrollId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class EmployeesService {
  /**
   * With self-registration open, the invitation email only proves an identity
   * once Keycloak has verified it. Disabled only for local development without SMTP.
   */
  private readonly requireVerifiedEmail: boolean;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.requireVerifiedEmail =
      configService.get<string>('KEYCLOAK_REQUIRE_VERIFIED_EMAIL', 'true') !== 'false';

    if (!this.requireVerifiedEmail && configService.get<string>('NODE_ENV') === 'production') {
      throw new Error(
        'KEYCLOAK_REQUIRE_VERIFIED_EMAIL=false is only allowed in local development',
      );
    }
  }

  listEmployees(companyId: string): Promise<EmployeeResponse[]> {
    return this.prisma.user.findMany({
      where: { companyId },
      select: employeeSelect,
      orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async getEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<EmployeeResponse> {
    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId },
      select: employeeSelect,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async updateEmployee(
    currentUser: ApplicationUser,
    employeeId: string,
    dto: UpdateEmployeeDto,
    now = new Date(),
  ): Promise<EmployeeResponse> {
    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: currentUser.companyId },
      select: { id: true, role: true, isActive: true, weeklyContractMinutes: true },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (
      employee.id === currentUser.id &&
      (dto.isActive === false ||
        (dto.role !== undefined && dto.role !== UserRole.ADMIN))
    ) {
      throw new ForbiddenException(
        'An administrator cannot deactivate or demote their own account',
      );
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.firstName !== undefined) {
      data.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      data.lastName = dto.lastName;
    }
    if (dto.email !== undefined) {
      data.email = dto.email;
    }
    if (dto.role !== undefined) {
      data.role = dto.role;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }
    if (dto.payrollId !== undefined) {
      data.payrollId = dto.payrollId || null;
    }

    const contractMinutes = dto.weeklyContractMinutes;
    if (contractMinutes === undefined && dto.contractEffectiveFrom !== undefined) {
      throw new BadRequestException('contractEffectiveFrom requires weeklyContractMinutes');
    }
    if (dto.contractEffectiveFrom !== undefined && !isValidDateKey(dto.contractEffectiveFrom)) {
      throw new BadRequestException('contractEffectiveFrom must be a valid date (YYYY-MM-DD)');
    }

    if (Object.keys(data).length === 0 && contractMinutes === undefined) {
      throw new BadRequestException('At least one employee field is required');
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        if (contractMinutes !== undefined) {
          data.weeklyContractMinutes = await this.changeContract(
            transaction,
            currentUser,
            employee,
            contractMinutes,
            dto.contractEffectiveFrom,
            now,
          );
        }

        return transaction.user.update({
          where: { id: employee.id },
          data,
          select: employeeSelect,
        });
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This payroll number is already used by another employee');
      }
      throw error;
    }
  }

  /**
   * Records a contract change from the Monday of the chosen week (the current
   * week by default), so that past weeks keep the contract they were worked
   * under. Returns the contract in force this week.
   */
  private async changeContract(
    transaction: Prisma.TransactionClient,
    currentUser: ApplicationUser,
    employee: { id: string; weeklyContractMinutes: number },
    weeklyContractMinutes: number,
    effectiveFromInput: string | undefined,
    now: Date,
  ): Promise<number> {
    const thisWeek = startOfWeek(toDateKey(now, currentUser.company.timezone));
    const effectiveFrom = startOfWeek(effectiveFromInput ?? thisWeek);

    // Employees created before the history existed keep their contract for the past.
    const existingPeriods = await transaction.contractPeriod.count({
      where: { userId: employee.id },
    });
    if (existingPeriods === 0 && effectiveFrom > CONTRACT_HISTORY_START) {
      await transaction.contractPeriod.create({
        data: initialContractPeriod(
          currentUser.companyId,
          employee.id,
          employee.weeklyContractMinutes,
        ),
      });
    }

    await transaction.contractPeriod.upsert({
      where: {
        userId_effectiveFrom: {
          userId: employee.id,
          effectiveFrom: dateKeyToDateColumn(effectiveFrom),
        },
      },
      create: {
        companyId: currentUser.companyId,
        userId: employee.id,
        effectiveFrom: dateKeyToDateColumn(effectiveFrom),
        weeklyContractMinutes,
      },
      update: { weeklyContractMinutes },
    });

    const current = await transaction.contractPeriod.findFirst({
      where: { userId: employee.id, effectiveFrom: { lte: dateKeyToDateColumn(thisWeek) } },
      orderBy: { effectiveFrom: 'desc' },
    });

    return current?.weeklyContractMinutes ?? employee.weeklyContractMinutes;
  }

  async createInvitation(
    currentUser: ApplicationUser,
    dto: CreateEmployeeInvitationDto,
  ): Promise<EmployeeInvitationResponse> {
    const email = dto.email.trim().toLowerCase();
    const role = dto.role ?? UserRole.EMPLOYEE;
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);

    try {
      const { invitation, replacesPrevious } = await this.prisma.$transaction(async (transaction) => {
        const existingEmployee = await transaction.user.findFirst({
          where: {
            companyId: currentUser.companyId,
            email: { equals: email, mode: 'insensitive' },
          },
          select: { id: true },
        });

        if (existingEmployee) {
          throw new ConflictException(
            'This email is already associated with an employee',
          );
        }

        // A new link replaces a lost or unused one: the previous link stops working.
        const now = new Date();
        const replaced = await transaction.employeeInvitation.updateMany({
          where: {
            companyId: currentUser.companyId,
            email,
            acceptedAt: null,
            expiresAt: { gt: now },
          },
          data: { expiresAt: now },
        });

        const created = await transaction.employeeInvitation.create({
          data: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            role,
            weeklyContractMinutes: dto.weeklyContractMinutes ?? DEFAULT_WEEKLY_CONTRACT_MINUTES,
            tokenHash: this.hashToken(token),
            companyId: currentUser.companyId,
            invitedById: currentUser.id,
            expiresAt,
          },
        });
        return { invitation: created, replacesPrevious: replaced.count > 0 };
      });

      return {
        id: invitation.id,
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        role: invitation.role,
        weeklyContractMinutes: invitation.weeklyContractMinutes,
        token,
        expiresAt: invitation.expiresAt,
        replacesPrevious,
      };
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This invitation could not be created');
      }

      throw error;
    }
  }

  /**
   * Shown by the invitation link before the person signs in, so that the
   * sign-up page can be pre-filled: only the holder of the link sees it.
   */
  async getInvitationPreview(token: string): Promise<EmployeeInvitationPreview> {
    const invitation = await this.prisma.employeeInvitation.findUnique({
      where: { tokenHash: this.hashToken(token) },
      include: { company: { select: { name: true } } },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.acceptedAt) {
      throw new ConflictException('This invitation has already been used');
    }
    if (invitation.expiresAt <= new Date()) {
      throw new GoneException('This invitation has expired');
    }

    return {
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
      role: invitation.role,
      companyName: invitation.company.name,
      expiresAt: invitation.expiresAt,
    };
  }

  async acceptInvitation(
    token: string,
    keycloakUser: KeycloakUser,
  ): Promise<ApplicationUserResponse> {
    if (!token) {
      throw new BadRequestException('Invitation token is required');
    }

    const identityEmail = keycloakUser.email?.trim().toLowerCase();
    if (!identityEmail) {
      throw new ForbiddenException(
        'A Keycloak email is required to accept this invitation',
      );
    }

    if (this.requireVerifiedEmail && keycloakUser.email_verified !== true) {
      throw new ForbiddenException(
        'The Keycloak email must be verified to accept this invitation',
      );
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const invitation = await transaction.employeeInvitation.findUnique({
          where: { tokenHash: this.hashToken(token) },
          include: { company: true },
        });

        if (!invitation) {
          throw new NotFoundException('Invitation not found');
        }

        if (invitation.acceptedAt) {
          throw new ConflictException('This invitation has already been used');
        }

        if (invitation.expiresAt <= new Date()) {
          throw new GoneException('This invitation has expired');
        }

        if (invitation.email !== identityEmail) {
          throw new ForbiddenException(
            'The invitation email does not match the authenticated Keycloak user',
          );
        }

        const claim = await transaction.employeeInvitation.updateMany({
          where: { id: invitation.id, acceptedAt: null },
          data: { acceptedAt: new Date() },
        });

        if (claim.count !== 1) {
          throw new ConflictException('This invitation has already been used');
        }

        const existingUser = await transaction.user.findUnique({
          where: { keycloakSubject: keycloakUser.sub },
          select: { id: true },
        });

        if (existingUser) {
          throw new ConflictException(
            'The Keycloak user is already associated with a company',
          );
        }

        const user = await transaction.user.create({
          data: {
            keycloakSubject: keycloakUser.sub,
            email: identityEmail,
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            role: invitation.role,
            weeklyContractMinutes: invitation.weeklyContractMinutes,
            isActive: true,
            companyId: invitation.companyId,
          },
        });

        await transaction.contractPeriod.create({
          data: initialContractPeriod(
            invitation.companyId,
            user.id,
            invitation.weeklyContractMinutes,
          ),
        });

        return toApplicationUserResponse(user, invitation.company);
      });
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof GoneException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'The Keycloak user is already associated with a company',
        );
      }

      throw error;
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
