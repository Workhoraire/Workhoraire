import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';
import { isInactiveAccount } from './account-disabled.guard';

export const onboardingGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map(() => router.createUrlTree(['/'])),
    // A deactivated employee must not be offered to create a company.
    catchError((response: HttpErrorResponse) =>
      of(isInactiveAccount(response) ? router.createUrlTree(['/account-disabled']) : true),
    ),
  );
};
