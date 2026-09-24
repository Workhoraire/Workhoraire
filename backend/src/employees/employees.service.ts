import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
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
  startOfLocalDay,
  startOfWeek,
  toDateKey,
} from '../common/dates/local-date';
import { formatMailDate, formatMailDuration, mailName } from '../notifications/mail-format';
import { contractChangeMail, invitationMail } from '../notifications/mail-templates';
import { MailService } from '../notifications/mail.service';
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

/** Invitations a company may send in 24 hours. */
const MAX_INVITATIONS_PER_DAY = 100;

/** A contract change: the contract in force from `effectiveFrom` (a Monday), before and after. */
interface ContractChange {
  effectiveFrom: string;
  before: number;
  after: number;
  /** Contract in force this week, after the change. */
  current: number;
}

@Injectable()
export class EmployeesService {
  /**
   * With self-registration open, the invitation email only proves an identity
   * once Keycloak has verified it. Disabled only for local development without SMTP.
   */
  private readonly requireVerifiedEmail: boolean;

  /** Origin of the application, for the links sent by e-mail. */
  private readonly appUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
    private readonly mail: MailService,
  ) {
    this.appUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:4200');
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
      select: { id: true, role: true, isActive: true, weeklyContractMinutes: true, createdAt: true },
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
    if (dto.role !== undefined) {
      data.role = dto.role;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }
    // Someone who loses the administrator role, or their access, must not come
    // back through an invitation they sent before.
    const losesAdministration =
      employee.role === UserRole.ADMIN &&
      (dto.isActive === false || (dto.role !== undefined && dto.role !== UserRole.ADMIN));
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

    const timezone = currentUser.company.timezone;
    const thisWeek = startOfWeek(toDateKey(now, timezone));
    const effectiveFrom = startOfWeek(dto.contractEffectiveFrom ?? thisWeek);
    // Weeks before the employee joined were never worked under this account.
    if (contractMinutes !== undefined && effectiveFrom < startOfWeek(toDateKey(employee.createdAt, timezone))) {
      throw new BadRequestException('The contract cannot change before the week the employee joined');
    }

    try {
      const { updated, contractChange } = await this.prisma.$transaction(async (transaction) => {
        const change =
          contractMinutes === undefined
            ? null
            : await this.changeContract(
                transaction,
                currentUser.companyId,
                employee,
                contractMinutes,
                effectiveFrom,
                thisWeek,
              );
        if (change) {
          data.weeklyContractMinutes = change.current;
        }

        if (losesAdministration) {
          await transaction.employeeInvitation.updateMany({
            where: { invitedById: employee.id, acceptedAt: null, expiresAt: { gt: now } },
            data: { expiresAt: now },
          });
        }

        const user = await transaction.user.update({
          where: { id: employee.id },
          data,
          select: employeeSelect,
        });
        return { updated: user, contractChange: change };
      });

      if (contractChange) {
        this.notifyContractChange(currentUser, updated, contractChange);
      }
      return updated;
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
   * Tells the employee by e-mail that their contractual time changes, in the
   * background: it never blocks nor undoes the change.
   */
  private notifyContractChange(
    actor: ApplicationUser,
    employee: EmployeeResponse,
    change: ContractChange,
  ): void {
    // Nobody needs an e-mail about a change they made to their own contract.
    if (
      !this.mail.enabled ||
      change.before === change.after ||
      employee.id === actor.id ||
      !employee.isActive ||
      !employee.email
    ) {
      return;
    }
    const timezone = actor.company.timezone;
    void this.mail.send(
      employee.email,
      contractChangeMail({
        firstName: employee.firstName,
        actorName: mailName(actor),
        before: formatMailDuration(change.before),
        after: formatMailDuration(change.after),
        fromWeek: formatMailDate(startOfLocalDay(change.effectiveFrom, timezone), timezone),
        link: `${this.appUrl}/my-time`,
      }),
    );
  }

  /**
   * Records a contract change from the Monday of the chosen week (the current
   * week by default), so that past weeks keep the contract they were worked
   * under.
   */
  private async changeContract(
    transaction: Prisma.TransactionClient,
    companyId: string,
    employee: { id: string; weeklyContractMinutes: number },
    weeklyContractMinutes: number,
    effectiveFrom: string,
    thisWeek: string,
  ): Promise<ContractChange> {
    // Employees created before the history existed keep their contract for the past.
    const existingPeriods = await transaction.contractPeriod.count({
      where: { userId: employee.id },
    });
    if (existingPeriods === 0 && effectiveFrom > CONTRACT_HISTORY_START) {
      await transaction.contractPeriod.create({
        data: initialContractPeriod(companyId, employee.id, employee.weeklyContractMinutes),
      });
    }

    const previous = await this.contractInForce(transaction, employee.id, effectiveFrom);
    await transaction.contractPeriod.upsert({
      where: {
        userId_effectiveFrom: {
          userId: employee.id,
          effectiveFrom: dateKeyToDateColumn(effectiveFrom),
        },
      },
      create: {
        companyId,
        userId: employee.id,
        effectiveFrom: dateKeyToDateColumn(effectiveFrom),
        weeklyContractMinutes,
      },
      update: { weeklyContractMinutes },
    });
    const current = await this.contractInForce(transaction, employee.id, thisWeek);

    return {
      effectiveFrom,
      before: previous ?? employee.weeklyContractMinutes,
      after: weeklyContractMinutes,
      current: current ?? employee.weeklyContractMinutes,
    };
  }

  /** Weekly minutes of the contract in force during the week starting on `weekStart`. */
  private async contractInForce(
    transaction: Prisma.TransactionClient,
    userId: string,
    weekStart: string,
  ): Promise<number | null> {
    const period = await transaction.contractPeriod.findFirst({
      where: { userId, effectiveFrom: { lte: dateKeyToDateColumn(weekStart) } },
      orderBy: { effectiveFrom: 'desc' },
    });
    return period?.weeklyContractMinutes ?? null;
  }

  /**
   * Keeps the contract "in force today" of every employee in step with the
   * dated history, once a change planned for a later week comes into force.
   * Returns the number of employees updated.
   */
  async refreshCurrentContracts(now = new Date()): Promise<number> {
    const companies = await this.prisma.company.findMany({ select: { id: true, timezone: true } });
    let updated = 0;

    for (const company of companies) {
      const thisWeek = startOfWeek(toDateKey(now, company.timezone));
      const periods = await this.prisma.contractPeriod.findMany({
        where: { companyId: company.id, effectiveFrom: { lte: dateKeyToDateColumn(thisWeek) } },
        orderBy: { effectiveFrom: 'desc' },
        select: { userId: true, weeklyContractMinutes: true, user: { select: { weeklyContractMinutes: true } } },
      });

      const seen = new Set<string>();
      for (const period of periods) {
        // The latest period of each employee is the one in force.
        if (seen.has(period.userId)) {
          continue;
        }
        seen.add(period.userId);
        if (period.weeklyContractMinutes === period.user.weeklyContractMinutes) {
          continue;
        }
        // Unless a change was saved meanwhile.
        const result = await this.prisma.user.updateMany({
          where: { id: period.userId, weeklyContractMinutes: period.user.weeklyContractMinutes },
          data: { weeklyContractMinutes: period.weeklyContractMinutes },
        });
        updated += result.count;
      }
    }
    return updated;
  }

  async createInvitation(
    currentUser: ApplicationUser,
    dto: CreateEmployeeInvitationDto,
  ): Promise<EmployeeInvitationResponse> {
    // Each invitation sends an e-mail to the address typed: a ceiling keeps
    // the service from being used to send mass e-mails.
    const sentToday = await this.prisma.employeeInvitation.count({
      where: {
        companyId: currentUser.companyId,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (sentToday >= MAX_INVITATIONS_PER_DAY) {
      throw new HttpException('Too many invitations today: try again tomorrow', HttpStatus.TOO_MANY_REQUESTS);
    }

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

      // The link also goes by e-mail: the invited person does not wait for a
      // copy-paste, and receiving it proves the address is theirs.
      const emailSent = await this.mail.send(
        invitation.email,
        invitationMail({
          firstName: invitation.firstName,
          companyName: currentUser.company.name,
          inviterName: mailName(currentUser),
          link: `${this.appUrl}/employee-invitations/${token}`,
          expiresOn: formatMailDate(invitation.expiresAt, currentUser.company.timezone),
        }),
      );

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
        emailSent,
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
        await transaction.employeeInvitation.update({
          where: { id: invitation.id },
          data: { acceptedById: user.id },
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
