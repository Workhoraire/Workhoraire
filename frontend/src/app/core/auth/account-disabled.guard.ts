import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';

export const INACTIVE_ACCOUNT_MESSAGE = 'The application user is inactive';

export function isInactiveAccount(response: HttpErrorResponse): boolean {
  return response.status === 403 && response.error?.message === INACTIVE_ACCOUNT_MESSAGE;
}

/** The "account disabled" page is only shown to accounts that really are disabled. */
export const accountDisabledGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map(() => router.createUrlTree(['/'])),
    catchError((response: HttpErrorResponse) =>
      of(isInactiveAccount(response) ? true : router.createUrlTree(['/'])),
    ),
  );
};
