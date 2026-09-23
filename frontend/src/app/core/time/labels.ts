import { UserRole } from '../auth/auth.models';
import { formatDuration } from './time-format';
import { AbsenceType, ComplianceAlert, ComplianceAlertCode } from './time.models';

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
};

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  PAID_LEAVE: 'Congés payés',
  RTT: 'RTT',
  SICK_LEAVE: 'Arrêt maladie',
  UNPAID_LEAVE: 'Congé sans solde',
  FAMILY_EVENT: 'Événement familial',
  OTHER: 'Autre absence',
};

export const ABSENCE_TYPES = Object.keys(ABSENCE_TYPE_LABELS) as AbsenceType[];

export type AbsenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export const ABSENCE_STATUS_LABELS: Record<AbsenceStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Acceptée',
  REJECTED: 'Refusée',
  CANCELLED: 'Annulée',
};

interface AlertDescription {
  title: string;
  /** Legal basis shown to the user, so that alerts are explainable. */
  reference: string;
}

export const ALERT_DESCRIPTIONS: Record<ComplianceAlertCode, AlertDescription> = {
  OPEN_ENTRY_TOO_LONG: {
    title: 'Sortie non pointée',
    reference: 'Pointage ouvert depuis plus de 12 h',
  },
  DAILY_MAX_EXCEEDED: {
    title: 'Plus de 10 h de travail dans la journée',
    reference: 'Durée quotidienne maximale, art. L3121-18 du Code du travail',
  },
  MISSING_BREAK: {
    title: 'Pause de 20 minutes manquante',
    reference: 'Pause obligatoire dès 6 h de travail, art. L3121-16',
  },
  INSUFFICIENT_DAILY_REST: {
    title: 'Repos quotidien inférieur à 11 h',
    reference: 'Repos quotidien minimal, art. L3131-1',
  },
  WEEKLY_MAX_EXCEEDED: {
    title: 'Plus de 48 h de travail dans la semaine',
    reference: 'Durée hebdomadaire maximale, art. L3121-20',
  },
  TOO_MANY_WORKING_DAYS: {
    title: 'Plus de 6 jours travaillés dans la semaine',
    reference: 'Interdiction de travailler plus de 6 jours par semaine, art. L3132-1',
  },
  COMPLEMENTARY_HOURS_LIMIT: {
    title: 'Heures complémentaires au-delà de 1/10 du contrat',
    reference: 'Limite légale sans accord collectif (temps partiel)',
  },
  WORK_DURING_ABSENCE: {
    title: 'Heures pointées pendant une absence validée',
    reference: 'Absence et travail le même jour : l’absence n’est pas décomptée, à régulariser',
  },
};

/** "Plus de 10 h de travail dans la journée : 11 h 05 (max. 10 h)" */
export function describeAlert(alert: ComplianceAlert): string {
  const title = ALERT_DESCRIPTIONS[alert.code].title;

  switch (alert.code) {
    case 'MISSING_BREAK':
      return alert.value === 0
        ? `${title} (aucune pause)`
        : `${title} (plus longue pause : ${formatDuration(alert.value)})`;
    case 'INSUFFICIENT_DAILY_REST':
      return `${title} (${formatDuration(alert.value)})`;
    case 'TOO_MANY_WORKING_DAYS':
      return `${title} (${alert.value} jours)`;
    case 'OPEN_ENTRY_TOO_LONG':
      return `${title} (ouvert depuis ${formatDuration(alert.value)})`;
    case 'WORK_DURING_ABSENCE':
      return `${title} (${formatDuration(alert.value)})`;
    default:
      return `${title} : ${formatDuration(alert.value)} (max. ${formatDuration(alert.limit)})`;
  }
}
