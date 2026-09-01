import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrentUser } from '../../core/auth/auth.models';
import { CurrentUserService } from '../../core/user/current-user.service';

@Injectable({ providedIn: 'root' })
export class EmployeeInvitationService {
  private readonly http = inject(HttpClient);
  private readonly currentUserService = inject(CurrentUserService);

  acceptInvitation(token: string): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(
        `${environment.apiUrl}/employee-invitations/${encodeURIComponent(token)}/accept`,
        {},
      )
      .pipe(tap((user) => this.currentUserService.setCurrentUser(user)));
  }
}
