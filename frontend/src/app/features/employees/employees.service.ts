import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateEmployeeInvitationRequest,
  Employee,
  EmployeeInvitation,
  UpdateEmployeeRequest,
} from './employee.models';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
  }

  createInvitation(
    payload: CreateEmployeeInvitationRequest,
  ): Observable<EmployeeInvitation> {
    return this.http.post<EmployeeInvitation>(
      `${environment.apiUrl}/employees/invitations`,
      payload,
    );
  }

  updateEmployee(
    employeeId: string,
    payload: UpdateEmployeeRequest,
  ): Observable<Employee> {
    return this.http.patch<Employee>(
      `${environment.apiUrl}/employees/${employeeId}`,
      payload,
    );
  }
}
