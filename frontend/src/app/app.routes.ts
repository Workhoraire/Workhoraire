import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { companyGuard } from './core/auth/company.guard';
import { onboardingGuard } from './core/auth/onboarding.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, companyGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(({ Dashboard }) => Dashboard),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding').then(({ Onboarding }) => Onboarding),
  },
  {
    path: 'employees',
    canActivate: [authGuard, companyGuard, adminGuard],
    loadComponent: () =>
      import('./features/employees/employees').then(({ Employees }) => Employees),
  },
  {
    path: 'employee-invitations/:token',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employees/employee-invitation').then(
        ({ EmployeeInvitation }) => EmployeeInvitation,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
