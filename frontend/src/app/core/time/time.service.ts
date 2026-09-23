import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ClockStatus,
  EmployeeTimesheet,
  TeamTimesheet,
  TimeEntry,
  TimeEntryAuditLog,
} from './time.models';

export interface CreateTimeEntryRequest {
  userId: string;
  startAt: string;
  endAt: string;
  note?: string;
  reason: string;
}

export interface UpdateTimeEntryRequest {
  startAt?: string;
  endAt?: string;
  note?: string;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getClockStatus(): Observable<ClockStatus> {
    return this.http.get<ClockStatus>(`${this.api}/time-clock/status`);
  }

  clockIn(note?: string): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.api}/time-clock/clock-in`, note ? { note } : {});
  }

  clockOut(note?: string): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.api}/time-clock/clock-out`, note ? { note } : {});
  }

  closeOpenEntry(endAt: string, reason: string): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.api}/time-clock/close-open-entry`, {
      endAt,
      reason,
    });
  }

  getMyTimesheet(from: string, to: string): Observable<EmployeeTimesheet> {
    return this.http.get<EmployeeTimesheet>(`${this.api}/timesheets/me`, {
      params: { from, to },
    });
  }

  getMyAuditLogs(from: string, to: string): Observable<TimeEntryAuditLog[]> {
    return this.http.get<TimeEntryAuditLog[]>(`${this.api}/time-clock/audit-logs`, {
      params: { from, to },
    });
  }

  getTeamTimesheet(from: string, to: string): Observable<TeamTimesheet> {
    return this.http.get<TeamTimesheet>(`${this.api}/timesheets/team`, {
      params: { from, to },
    });
  }

  getEmployeeTimesheet(employeeId: string, from: string, to: string): Observable<EmployeeTimesheet> {
    return this.http.get<EmployeeTimesheet>(
      `${this.api}/timesheets/employees/${encodeURIComponent(employeeId)}`,
      { params: { from, to } },
    );
  }

  getAuditLogs(from: string, to: string, employeeId?: string): Observable<TimeEntryAuditLog[]> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (employeeId) {
      params = params.set('employeeId', employeeId);
    }
    return this.http.get<TimeEntryAuditLog[]>(`${this.api}/time-entries/audit-logs`, { params });
  }

  createEntry(payload: CreateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.api}/time-entries`, payload);
  }

  updateEntry(entryId: string, payload: UpdateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(
      `${this.api}/time-entries/${encodeURIComponent(entryId)}`,
      payload,
    );
  }

  deleteEntry(entryId: string, reason: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/time-entries/${encodeURIComponent(entryId)}`, {
      body: { reason },
    });
  }
}
