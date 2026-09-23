import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AbsenceStatus } from '../../core/time/labels';
import { AbsenceType, PersonSummary } from '../../core/time/time.models';

export interface AbsenceRequest {
  id: string;
  employee: PersonSummary;
  type: AbsenceType;
  status: AbsenceStatus;
  startDate: string;
  endDate: string;
  startsAfternoon: boolean;
  endsMorning: boolean;
  days: number;
  comment: string | null;
  reviewComment: string | null;
  reviewedBy: PersonSummary | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface CreateAbsenceRequest {
  type: AbsenceType;
  startDate: string;
  endDate: string;
  startsAfternoon: boolean;
  endsMorning: boolean;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class AbsencesService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/absences`;

  listMine(): Observable<AbsenceRequest[]> {
    return this.http.get<AbsenceRequest[]>(`${this.api}/me`);
  }

  listTeam(status?: AbsenceStatus): Observable<AbsenceRequest[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<AbsenceRequest[]>(this.api, { params });
  }

  create(payload: CreateAbsenceRequest): Observable<AbsenceRequest> {
    return this.http.post<AbsenceRequest>(this.api, payload);
  }

  cancel(id: string): Observable<AbsenceRequest> {
    return this.http.post<AbsenceRequest>(`${this.api}/${encodeURIComponent(id)}/cancel`, {});
  }

  approve(id: string, comment?: string): Observable<AbsenceRequest> {
    return this.http.post<AbsenceRequest>(
      `${this.api}/${encodeURIComponent(id)}/approve`,
      comment ? { comment } : {},
    );
  }

  reject(id: string, comment?: string): Observable<AbsenceRequest> {
    return this.http.post<AbsenceRequest>(
      `${this.api}/${encodeURIComponent(id)}/reject`,
      comment ? { comment } : {},
    );
  }
}
