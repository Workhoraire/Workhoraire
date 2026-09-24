import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

type Person = { firstName: string | null; lastName: string | null } | null;

function personName(person: Person): string | null {
  if (!person) {
    return null;
  }
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || null;
}

/** "2026-09-21" for a date column. */
function dateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

const personSelect = { select: { firstName: true, lastName: true } } as const;

/**
 * Everything WorkHoraire stores about the signed-in person, for the rights of
 * access and portability (GDPR, articles 15 and 20). Only the person's own
 * records are read, always within their company; what they did about other
 * people is reduced to the person concerned, the date and the action.
 */
@Injectable()
export class PersonalDataService {
  constructor(private readonly prisma: PrismaService) {}

  async export(user: ApplicationUser, now = new Date()): Promise<Record<string, unknown>> {
    const scope = { companyId: user.companyId };
    const others = { not: user.id };
    const [
      contracts,
      entries,
      absences,
      corrections,
      invitation,
      invitationsSent,
      correctionsMade,
      absenceDecisions,
      entriesCreated,
      companyCreator,
    ] = await Promise.all([
      this.prisma.contractPeriod.findMany({
        where: { ...scope, userId: user.id },
        orderBy: { effectiveFrom: 'asc' },
      }),
      this.prisma.timeEntry.findMany({
        where: { ...scope, userId: user.id },
        orderBy: { startAt: 'asc' },
        include: { createdBy: personSelect },
      }),
      this.prisma.absenceRequest.findMany({
        where: { ...scope, userId: user.id },
        orderBy: { startDate: 'asc' },
        include: { reviewedBy: personSelect },
      }),
      this.prisma.timeEntryAuditLog.findMany({
        where: { ...scope, employeeId: user.id },
        orderBy: { createdAt: 'asc' },
        include: { actor: personSelect },
      }),
      this.prisma.employeeInvitation.findFirst({
        where: { ...scope, acceptedById: user.id },
        orderBy: { acceptedAt: 'desc' },
        include: { invitedBy: personSelect },
      }),
      this.prisma.employeeInvitation.findMany({
        where: { ...scope, invitedById: user.id },
        orderBy: { createdAt: 'asc' },
        select: { firstName: true, lastName: true, role: true, createdAt: true },
      }),
      this.prisma.timeEntryAuditLog.findMany({
        where: { ...scope, actorId: user.id, employeeId: others },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true, action: true, employee: personSelect },
      }),
      this.prisma.absenceRequest.findMany({
        where: { ...scope, reviewedById: user.id, userId: others },
        orderBy: { reviewedAt: 'asc' },
        select: { reviewedAt: true, status: true, user: personSelect },
      }),
      this.prisma.timeEntry.findMany({
        where: { ...scope, createdById: user.id, userId: others },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true, user: personSelect },
      }),
      // The company is created with its first account, which accepts the terms.
      this.prisma.user.findFirst({
        where: scope,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true },
      }),
    ]);

    const acceptedTerms = companyCreator?.id === user.id && user.company.termsAcceptedAt !== null;

    return {
      exportedAt: now.toISOString(),
      notice:
        'Données vous concernant enregistrées dans WorkHoraire pour le compte de votre employeur, responsable du traitement (articles 15 et 20 du RGPD). Les heures sont en UTC, au format ISO 8601.',
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        payrollId: user.payrollId,
        weeklyContractMinutes: user.weeklyContractMinutes,
        company: { name: user.company.name, timezone: user.company.timezone },
        createdAt: user.createdAt.toISOString(),
      },
      termsAcceptance: acceptedTerms
        ? {
            acceptedAt: user.company.termsAcceptedAt?.toISOString() ?? null,
            version: user.company.termsVersion,
          }
        : null,
      invitation: invitation
        ? {
            email: invitation.email,
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            role: invitation.role,
            weeklyContractMinutes: invitation.weeklyContractMinutes,
            invitedBy: personName(invitation.invitedBy),
            createdAt: invitation.createdAt.toISOString(),
            expiresAt: invitation.expiresAt.toISOString(),
            acceptedAt: invitation.acceptedAt?.toISOString() ?? null,
          }
        : null,
      contractPeriods: contracts.map((contract) => ({
        effectiveFrom: dateKey(contract.effectiveFrom),
        weeklyContractMinutes: contract.weeklyContractMinutes,
      })),
      timeEntries: entries.map((entry) => ({
        startAt: entry.startAt.toISOString(),
        endAt: entry.endAt?.toISOString() ?? null,
        source: entry.source,
        note: entry.note,
        enteredBy: entry.createdById === user.id ? 'vous' : personName(entry.createdBy),
        reminderSentAt: entry.reminderSentAt?.toISOString() ?? null,
        createdAt: entry.createdAt.toISOString(),
      })),
      absences: absences.map((absence) => ({
        type: absence.type,
        status: absence.status,
        startDate: dateKey(absence.startDate),
        endDate: dateKey(absence.endDate),
        startsAfternoon: absence.startsAfternoon,
        endsMorning: absence.endsMorning,
        comment: absence.comment,
        reviewComment: absence.reviewComment,
        reviewedBy: personName(absence.reviewedBy),
        reviewedAt: absence.reviewedAt?.toISOString() ?? null,
        createdAt: absence.createdAt.toISOString(),
      })),
      corrections: corrections.map((correction) => ({
        createdAt: correction.createdAt.toISOString(),
        action: correction.action,
        reason: correction.reason,
        before: correction.before,
        after: correction.after,
        by: personName(correction.actor),
      })),
      invitationsSent: invitationsSent.map((sent) => ({
        name: personName(sent),
        role: sent.role,
        createdAt: sent.createdAt.toISOString(),
      })),
      correctionsMade: correctionsMade.map((made) => ({
        createdAt: made.createdAt.toISOString(),
        action: made.action,
        employee: personName(made.employee),
      })),
      absenceDecisions: absenceDecisions.map((decision) => ({
        reviewedAt: decision.reviewedAt?.toISOString() ?? null,
        decision: decision.status,
        employee: personName(decision.user),
      })),
      entriesCreatedForOthers: entriesCreated.map((entry) => ({
        createdAt: entry.createdAt.toISOString(),
        action: 'CREATED',
        employee: personName(entry.user),
      })),
    };
  }
}
