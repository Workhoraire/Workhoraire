import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';
import { isInactiveAccount } from './account-disabled.guard';

export const companyGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map(() => true),
    catchError((response: HttpErrorResponse) => {
      if (
        response.status === 403 &&
        response.error?.message === 'The Keycloak user is not associated with a company'
      ) {
        return of(router.createUrlTree(['/onboarding']));
      }

      // A deactivated employee gets an explanation instead of pages full of errors.
      if (isInactiveAccount(response)) {
        return of(router.createUrlTree(['/account-disabled']));
      }

      return of(true);
    }),
  );
};
