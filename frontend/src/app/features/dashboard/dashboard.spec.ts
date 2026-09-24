import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CurrentUserService } from '../../core/user/current-user.service';
import { Dashboard } from './dashboard';
import { DashboardService, TeamDashboard } from './dashboard.service';

function board(activeEmployees: number): TeamDashboard {
  return {
    date: '2026-09-24',
    timezone: 'Europe/Paris',
    activeEmployees,
    todayWorkedMinutes: 0,
    presentNow: [],
    absentToday: [],
    pendingAbsenceRequests: 0,
    week: {
      weekStart: '2026-09-21',
      weekEnd: '2026-09-27',
      workedMinutes: 0,
      overtimeMinutes: 0,
      complementaryMinutes: 0,
    },
    alerts: [],
  };
}

async function render(role: 'ADMIN' | 'MANAGER', activeEmployees: number) {
  await TestBed.configureTestingModule({
    imports: [Dashboard],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      {
        provide: DashboardService,
        useValue: { getTeamDashboard: () => of(board(activeEmployees)) },
      },
      { provide: CurrentUserService, useValue: { getCurrentUser: () => of({ role }) } },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(Dashboard);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('Dashboard', () => {
  it('guides the administrator of a new company through the first steps', async () => {
    const element = await render('ADMIN', 1);
    const steps = element.querySelector('.first-steps');

    expect(steps?.textContent).toContain('Invitez vos salariés.');
    expect(steps?.textContent).toContain('Informez-les avant leur premier pointage');
    expect(
      Array.from(steps!.querySelectorAll('a')).map((link) => link.getAttribute('href')),
    ).toContain('http://localhost:4400/guides/informer-les-salaries');
  });

  it('hides the first steps once the team is there, and from managers', async () => {
    expect((await render('ADMIN', 4)).querySelector('.first-steps')).toBeNull();
    TestBed.resetTestingModule();
    expect((await render('MANAGER', 1)).querySelector('.first-steps')).toBeNull();
  });
});
