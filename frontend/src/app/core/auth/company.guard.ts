import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';

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

      return of(true);
    }),
  );
};
