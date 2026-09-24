import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

import { CurrentUserService } from '../user/current-user.service';
import { accountDisabledGuard } from './account-disabled.guard';
import { companyGuard } from './company.guard';
import { onboardingGuard } from './onboarding.guard';

type Guard = typeof companyGuard;

function forbidden(message: string): () => Observable<never> {
  return () => throwError(() => new HttpErrorResponse({ status: 403, error: { message } }));
}

async function run(guard: Guard, getCurrentUser: () => Observable<unknown>): Promise<string | boolean> {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: CurrentUserService, useValue: { getCurrentUser } }],
  });
  const result = await firstValueFrom(
    TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as Observable<boolean | UrlTree>,
  );
  return result instanceof UrlTree ? TestBed.inject(Router).serializeUrl(result) : result;
}

const notAssociated = forbidden('The Keycloak user is not associated with a company');
const inactive = forbidden('The application user is inactive');

describe('Account guards', () => {
  it('lets an active employee into the application', async () => {
    expect(await run(companyGuard, () => of({}))).toBeTrue();
  });

  it('sends an account without company to the company creation', async () => {
    expect(await run(companyGuard, notAssociated)).toBe('/onboarding');
  });

  it('sends a deactivated employee to a dedicated page, never to the company creation', async () => {
    expect(await run(companyGuard, inactive)).toBe('/account-disabled');
    TestBed.resetTestingModule();
    expect(await run(onboardingGuard, inactive)).toBe('/account-disabled');
  });

  it('only shows the "account disabled" page to a disabled account', async () => {
    expect(await run(accountDisabledGuard, inactive)).toBeTrue();
    TestBed.resetTestingModule();
    expect(await run(accountDisabledGuard, () => of({}))).toBe('/');
    TestBed.resetTestingModule();
    expect(await run(accountDisabledGuard, notAssociated)).toBe('/');
  });
});
