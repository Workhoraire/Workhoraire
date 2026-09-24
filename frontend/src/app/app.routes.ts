import { Routes } from '@angular/router';

import { accountDisabledGuard } from './core/auth/account-disabled.guard';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { companyGuard } from './core/auth/company.guard';
import { homeRedirectGuard, managerGuard } from './core/auth/manager.guard';
import { onboardingGuard } from './core/auth/onboarding.guard';

export const routes: Routes = [
  {
    path: 'onboarding',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding').then(({ Onboarding }) => Onboarding),
  },
  {
    path: 'account-disabled',
    title: 'Compte désactivé · WorkHoraire',
    canActivate: [authGuard, accountDisabledGuard],
    loadComponent: () =>
      import('./features/account-disabled/account-disabled').then(
        ({ AccountDisabled }) => AccountDisabled,
      ),
  },
  {
    // No guard: the website's sign-up links land here before any account exists.
    path: 'inscription',
    title: 'Inscription · WorkHoraire',
    loadComponent: () => import('./features/sign-up/sign-up').then(({ SignUp }) => SignUp),
  },
  {
    // No guard: the page welcomes the invited person before they have an account.
    path: 'employee-invitations/:token',
    loadComponent: () =>
      import('./features/employees/employee-invitation').then(
        ({ EmployeeInvitation }) => EmployeeInvitation,
      ),
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/shell').then(({ Shell }) => Shell),
    canActivate: [authGuard, companyGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [homeRedirectGuard],
        children: [],
      },
      {
        path: 'clock',
        title: 'Pointer · WorkHoraire',
        loadComponent: () => import('./features/clock/clock').then(({ Clock }) => Clock),
      },
      {
        path: 'my-time',
        title: 'Mes heures · WorkHoraire',
        loadComponent: () => import('./features/my-time/my-time').then(({ MyTime }) => MyTime),
      },
      {
        path: 'absences',
        title: 'Absences · WorkHoraire',
        loadComponent: () =>
          import('./features/absences/absences').then(({ Absences }) => Absences),
      },
      {
        path: 'dashboard',
        title: 'Tableau de bord · WorkHoraire',
        canActivate: [managerGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(({ Dashboard }) => Dashboard),
      },
      {
        path: 'team',
        title: 'Heures de l’équipe · WorkHoraire',
        canActivate: [managerGuard],
        loadComponent: () => import('./features/team/team').then(({ Team }) => Team),
      },
      {
        path: 'team/:employeeId',
        title: 'Feuille de temps · WorkHoraire',
        canActivate: [managerGuard],
        loadComponent: () =>
          import('./features/team/employee-timesheet').then(
            ({ EmployeeTimesheetPage }) => EmployeeTimesheetPage,
          ),
      },
      {
        path: 'exports',
        title: 'Exports paie · WorkHoraire',
        canActivate: [managerGuard],
        loadComponent: () => import('./features/exports/exports').then(({ Exports }) => Exports),
      },
      {
        path: 'employees',
        title: 'Salariés · WorkHoraire',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/employees/employees').then(({ Employees }) => Employees),
      },
      {
        path: 'abonnement',
        title: 'Abonnement · WorkHoraire',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/billing/billing').then(({ Billing }) => Billing),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
