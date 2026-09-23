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
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInvitationDto } from './dto/create-employee-invitation.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
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
  ): Promise<EmployeeResponse> {
    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: currentUser.companyId },
      select: { id: true, role: true, isActive: true },
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
    if (dto.weeklyContractMinutes !== undefined) {
      data.weeklyContractMinutes = dto.weeklyContractMinutes;
    }
    if (dto.payrollId !== undefined) {
      data.payrollId = dto.payrollId || null;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one employee field is required');
    }

    return this.prisma.user.update({
      where: { id: employee.id },
      data,
      select: employeeSelect,
    });
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
      const invitation = await this.prisma.$transaction(async (transaction) => {
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

        const pendingInvitation = await transaction.employeeInvitation.findFirst({
          where: {
            companyId: currentUser.companyId,
            email,
            acceptedAt: null,
            expiresAt: { gt: new Date() },
          },
          select: { id: true },
        });

        if (pendingInvitation) {
          throw new ConflictException(
            'An active invitation already exists for this email',
          );
        }

        return transaction.employeeInvitation.create({
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
