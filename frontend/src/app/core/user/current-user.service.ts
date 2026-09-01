import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrentUser } from '../auth/auth.models';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly http = inject(HttpClient);
  private cachedUser: CurrentUser | null = null;
  private currentUserRequest?: Observable<CurrentUser>;

  getCurrentUser(): Observable<CurrentUser> {
    if (this.cachedUser) {
      return of(this.cachedUser);
    }

    if (!this.currentUserRequest) {
      this.currentUserRequest = this.http
        .get<CurrentUser>(`${environment.apiUrl}/me`)
        .pipe(
          tap((user) => this.setCurrentUser(user)),
          catchError((error: unknown) => {
            this.currentUserRequest = undefined;
            return throwError(() => error);
          }),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }

    return this.currentUserRequest;
  }

  setCurrentUser(user: CurrentUser): void {
    this.cachedUser = user;
    this.currentUserRequest = undefined;
  }

  clearCurrentUser(): void {
    this.cachedUser = null;
    this.currentUserRequest = undefined;
  }
}
