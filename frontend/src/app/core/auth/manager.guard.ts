import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';
import { isManagerRole } from './auth.models';

/** Pages for managers and administrators. The backend enforces the same rule. */
export const managerGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map((user) => (isManagerRole(user.role) ? true : router.createUrlTree(['/clock']))),
    catchError(() => of(router.createUrlTree(['/clock']))),
  );
};

/** Sends managers to their dashboard and employees to the clock page. */
export const homeRedirectGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map((user) => router.createUrlTree([isManagerRole(user.role) ? '/dashboard' : '/clock'])),
    catchError(() => of(router.createUrlTree(['/clock']))),
  );
};
