import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrentUser, UserRole } from '../../core/auth/auth.models';
import { CurrentUserService } from '../../core/user/current-user.service';

/** What the link shows before the invited person has an account. */
export interface InvitationPreview {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyName: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeInvitationService {
  private readonly http = inject(HttpClient);
  private readonly currentUserService = inject(CurrentUserService);

  getInvitation(token: string): Observable<InvitationPreview> {
    return this.http.get<InvitationPreview>(
      `${environment.apiUrl}/employee-invitations/${encodeURIComponent(token)}`,
    );
  }

  acceptInvitation(token: string): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(
        `${environment.apiUrl}/employee-invitations/${encodeURIComponent(token)}/accept`,
        {},
      )
      .pipe(tap((user) => this.currentUserService.setCurrentUser(user)));
  }
}
