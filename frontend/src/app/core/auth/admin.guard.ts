import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';

export const adminGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map((user) =>
      user.role === 'ADMIN' ? true : router.createUrlTree(['/']),
    ),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
