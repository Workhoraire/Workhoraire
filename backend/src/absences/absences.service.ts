import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbsenceStatus, Prisma, UserRole } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import {
  dateColumnToKey,
  dateKeyToDateColumn,
  daysBetween,
  isValidDateKey,
  toDateKey,
} from '../common/dates/local-date';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatorAbsence, countAbsenceDays } from '../timesheets/timesheet.calculator';
import { AbsenceRequestResponse } from './absence.types';
import {
  CreateAbsenceRequestDto,
  ListAbsenceRequestsQueryDto,
  ReviewAbsenceRequestDto,
} from './dto/absence.dto';

const MAX_REQUEST_DAYS = 366;
const personSelect = { id: true, firstName: true, lastName: true } as const;
const absenceInclude = {
  user: { select: personSelect },
  reviewedBy: { select: personSelect },
} as const;

type AbsenceWithPeople = Prisma.AbsenceRequestGetPayload<{ include: typeof absenceInclude }>;
type Span = Omit<CalculatorAbsence, 'id' | 'type'>;

/** Half-day slots covered by a span (two slots per day), used to detect overlaps. */
function halfDaySlots(span: Span): { first: number; last: number } {
  const startDay = daysBetween('1970-01-01', span.startDate);
  const endDay = daysBetween('1970-01-01', span.endDate);

  return {
    first: startDay * 2 + (span.startsAfternoon ? 1 : 0),
    last: endDay * 2 + (span.endsMorning ? 0 : 1),
  };
}

export function spansOverlap(left: Span, right: Span): boolean {
  const a = halfDaySlots(left);
  const b = halfDaySlots(right);

  return a.first <= b.last && b.first <= a.last;
}

@Injectable()
export class AbsencesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(
    user: ApplicationUser,
    dto: CreateAbsenceRequestDto,
  ): Promise<AbsenceRequestResponse> {
    const span: Span = {
      startDate: dto.startDate,
      endDate: dto.endDate,
      startsAfternoon: dto.startsAfternoon ?? false,
      endsMorning: dto.endsMorning ?? false,
    };
    this.assertValidSpan(span);

    const candidates = await this.prisma.absenceRequest.findMany({
      where: {
        companyId: user.companyId,
        userId: user.id,
        status: { in: [AbsenceStatus.PENDING, AbsenceStatus.APPROVED] },
        startDate: { lte: dateKeyToDateColumn(span.endDate) },
        endDate: { gte: dateKeyToDateColumn(span.startDate) },
      },
    });

    if (candidates.some((candidate) => spansOverlap(this.toSpan(candidate), span))) {
      throw new ConflictException('This period overlaps another absence request');
    }

    const request = await this.prisma.absenceRequest.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        type: dto.type,
        startDate: dateKeyToDateColumn(span.startDate),
        endDate: dateKeyToDateColumn(span.endDate),
        startsAfternoon: span.startsAfternoon,
        endsMorning: span.endsMorning,
        comment: dto.comment || null,
      },
      include: absenceInclude,
    });

    return this.toResponse(request);
  }

  listOwnRequests(
    user: ApplicationUser,
    query: ListAbsenceRequestsQueryDto,
  ): Promise<AbsenceRequestResponse[]> {
    return this.listRequests(user.companyId, { ...query, employeeId: user.id });
  }

  listCompanyRequests(
    actor: ApplicationUser,
    query: ListAbsenceRequestsQueryDto,
  ): Promise<AbsenceRequestResponse[]> {
    return this.listRequests(actor.companyId, query);
  }

  /** An employee cancels a pending request, or an approved one that has not started yet. */
  async cancelOwnRequest(
    user: ApplicationUser,
    requestId: string,
    now = new Date(),
  ): Promise<AbsenceRequestResponse> {
    const request = await this.prisma.absenceRequest.findFirst({
      where: { id: requestId, companyId: user.companyId, userId: user.id },
    });

    if (!request) {
      throw new NotFoundException('Absence request not found');
    }

    const today = toDateKey(now, user.company.timezone);
    const cancellable =
      request.status === AbsenceStatus.PENDING ||
      (request.status === AbsenceStatus.APPROVED && dateColumnToKey(request.startDate) > today);

    if (!cancellable) {
      throw new ConflictException('This absence request can no longer be cancelled');
    }

    return this.transition(request.id, request.status, { status: AbsenceStatus.CANCELLED });
  }

  approveRequest(
    actor: ApplicationUser,
    requestId: string,
    dto: ReviewAbsenceRequestDto,
    now = new Date(),
  ): Promise<AbsenceRequestResponse> {
    return this.review(actor, requestId, AbsenceStatus.APPROVED, dto, now);
  }

  rejectRequest(
    actor: ApplicationUser,
    requestId: string,
    dto: ReviewAbsenceRequestDto,
    now = new Date(),
  ): Promise<AbsenceRequestResponse> {
    return this.review(actor, requestId, AbsenceStatus.REJECTED, dto, now);
  }

  private async review(
    actor: ApplicationUser,
    requestId: string,
    decision: AbsenceStatus,
    dto: ReviewAbsenceRequestDto,
    now: Date,
  ): Promise<AbsenceRequestResponse> {
    const request = await this.prisma.absenceRequest.findFirst({
      where: { id: requestId, companyId: actor.companyId },
    });

    if (!request) {
      throw new NotFoundException('Absence request not found');
    }

    if (actor.role === UserRole.MANAGER && request.userId === actor.id) {
      throw new ForbiddenException('A manager cannot review their own absence request');
    }

    if (request.status !== AbsenceStatus.PENDING) {
      throw new ConflictException('This absence request has already been reviewed');
    }

    return this.transition(request.id, AbsenceStatus.PENDING, {
      status: decision,
      reviewComment: dto.comment || null,
      reviewedById: actor.id,
      reviewedAt: now,
    });
  }

  /** Status change guarded by the current status, so that two reviewers cannot both win. */
  private async transition(
    requestId: string,
    expectedStatus: AbsenceStatus,
    data: Prisma.AbsenceRequestUncheckedUpdateInput,
  ): Promise<AbsenceRequestResponse> {
    try {
      const updated = await this.prisma.absenceRequest.update({
        where: { id: requestId, status: expectedStatus },
        data,
        include: absenceInclude,
      });

      return this.toResponse(updated);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException('This absence request has changed, reload it and retry');
      }
      throw error;
    }
  }

  private async listRequests(
    companyId: string,
    query: ListAbsenceRequestsQueryDto,
  ): Promise<AbsenceRequestResponse[]> {
    if ((query.from && !isValidDateKey(query.from)) || (query.to && !isValidDateKey(query.to))) {
      throw new BadRequestException('Dates must be valid calendar dates (YYYY-MM-DD)');
    }

    const requests = await this.prisma.absenceRequest.findMany({
      where: {
        companyId,
        ...(query.employeeId ? { userId: query.employeeId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.to ? { startDate: { lte: dateKeyToDateColumn(query.to) } } : {}),
        ...(query.from ? { endDate: { gte: dateKeyToDateColumn(query.from) } } : {}),
      },
      include: absenceInclude,
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      take: 500,
    });

    return requests.map((request) => this.toResponse(request));
  }

  private assertValidSpan(span: Span): void {
    if (!isValidDateKey(span.startDate) || !isValidDateKey(span.endDate)) {
      throw new BadRequestException('Dates must be valid calendar dates (YYYY-MM-DD)');
    }

    if (span.endDate < span.startDate) {
      throw new BadRequestException('The end date must be on or after the start date');
    }

    if (daysBetween(span.startDate, span.endDate) + 1 > MAX_REQUEST_DAYS) {
      throw new BadRequestException(`A request cannot exceed ${MAX_REQUEST_DAYS} days`);
    }

    if (span.startDate === span.endDate && span.startsAfternoon && span.endsMorning) {
      throw new BadRequestException('A single day cannot start in the afternoon and end in the morning');
    }

    if (countAbsenceDays({ id: '', type: 'OTHER', ...span }) === 0) {
      throw new BadRequestException('The request does not cover any working day');
    }
  }

  private toSpan(request: {
    startDate: Date;
    endDate: Date;
    startsAfternoon: boolean;
    endsMorning: boolean;
  }): Span {
    return {
      startDate: dateColumnToKey(request.startDate),
      endDate: dateColumnToKey(request.endDate),
      startsAfternoon: request.startsAfternoon,
      endsMorning: request.endsMorning,
    };
  }

  private toResponse(request: AbsenceWithPeople): AbsenceRequestResponse {
    const span = this.toSpan(request);

    return {
      id: request.id,
      employee: request.user,
      type: request.type,
      status: request.status,
      ...span,
      days: countAbsenceDays({ id: request.id, type: request.type, ...span }),
      comment: request.comment,
      reviewComment: request.reviewComment,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt?.toISOString() ?? null,
      createdAt: request.createdAt.toISOString(),
    };
  }
}
