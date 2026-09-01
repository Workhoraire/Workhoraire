import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrentUser } from '../../core/auth/auth.models';
import { CurrentUserService } from '../../core/user/current-user.service';
import { CreateCompanyRequest } from './onboarding.models';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly http = inject(HttpClient);
  private readonly currentUserService = inject(CurrentUserService);

  createCompany(payload: CreateCompanyRequest): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(`${environment.apiUrl}/onboarding/company`, payload)
      .pipe(tap((user) => this.currentUserService.setCurrentUser(user)));
  }
}
