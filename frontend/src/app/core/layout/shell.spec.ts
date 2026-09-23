import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { CurrentUser, UserRole } from '../auth/auth.models';
import { CurrentUserService } from '../user/current-user.service';
import { Shell } from './shell';

function userWithRole(role: UserRole): CurrentUser {
  return {
    id: 'user-1',
    subject: 'subject-1',
    email: 'emma@example.com',
    firstName: 'Emma',
    lastName: 'Leroy',
    isActive: true,
    role,
    weeklyContractMinutes: 2100,
    company: { id: 'company-1', name: 'Boulangerie Martin', timezone: 'Europe/Paris' },
  };
}

async function renderShellAs(role: UserRole): Promise<HTMLElement> {
  await TestBed.configureTestingModule({
    imports: [Shell],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: AuthService, useValue: { logout: () => Promise.resolve() } },
      {
        provide: CurrentUserService,
        useValue: {
          getCurrentUser: () => of(userWithRole(role)),
          clearCurrentUser: () => undefined,
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Shell);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

/** Visible labels of a navigation, without the icon ligatures. */
function labels(element: HTMLElement, selector: string): string[] {
  return Array.from(element.querySelectorAll(`${selector} > span`)).map((label) =>
    (label.textContent ?? '').trim(),
  );
}

function sideLinks(element: HTMLElement): string[] {
  return labels(element, '.side-nav .nav-link');
}

describe('Shell navigation', () => {
  it('only shows the personal pages to an employee', async () => {
    const element = await renderShellAs('EMPLOYEE');

    expect(sideLinks(element)).toEqual(['Pointer', 'Mes heures', 'Absences']);
    expect(element.querySelectorAll('.bottom-nav .bottom-link').length).toBe(3);
    expect(element.textContent).toContain('Boulangerie Martin');
  });

  it('adds the team pages for a manager, without employee administration', async () => {
    const links = sideLinks(await renderShellAs('MANAGER'));

    expect(links).toContain('Heures de l’équipe');
    expect(links).toContain('Exports paie');
    expect(links.some((label) => label.includes('Salariés'))).toBeFalse();
  });

  it('gives administrators every page and moves the extra ones to the "Plus" menu on phones', async () => {
    const element = await renderShellAs('ADMIN');

    expect(sideLinks(element).length).toBe(7);
    expect(labels(element, '.bottom-nav .bottom-link')).toEqual([
      'Accueil',
      'Pointer',
      'Équipe',
      'Absences',
      'Plus',
    ]);
  });
});
