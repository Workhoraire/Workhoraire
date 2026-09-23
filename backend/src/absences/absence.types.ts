import { AbsenceStatus, AbsenceType } from '@prisma/client';
import { PersonSummary } from '../time-entries/time-entry.types';

export interface AbsenceRequestResponse {
  id: string;
  employee: PersonSummary;
  type: AbsenceType;
  status: AbsenceStatus;
  startDate: string;
  endDate: string;
  startsAfternoon: boolean;
  endsMorning: boolean;
  /** Working days ("jours ouvrés") covered by the request. */
  days: number;
  comment: string | null;
  reviewComment: string | null;
  reviewedBy: PersonSummary | null;
  reviewedAt: string | null;
  createdAt: string;
}
