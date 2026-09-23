import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AbsenceType, ComplianceAlert, PersonSummary } from '../../core/time/time.models';

export interface TeamDashboard {
  date: string;
  timezone: string;
  activeEmployees: number;
  presentNow: Array<{ employee: PersonSummary; since: string; isOverdue: boolean }>;
  todayWorkedMinutes: number;
  absentToday: Array<{ employee: PersonSummary; type: AbsenceType; portion: number }>;
  pendingAbsenceRequests: number;
  week: {
    weekStart: string;
    weekEnd: string;
    workedMinutes: number;
    overtimeMinutes: number;
    complementaryMinutes: number;
  };
  alerts: Array<{ employee: PersonSummary; alert: ComplianceAlert }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getTeamDashboard(): Observable<TeamDashboard> {
    return this.http.get<TeamDashboard>(`${environment.apiUrl}/dashboard/team`);
  }
}
