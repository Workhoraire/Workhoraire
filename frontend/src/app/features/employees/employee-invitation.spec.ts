import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { EmployeeInvitation } from './employee-invitation';
import { EmployeeInvitationService, InvitationPreview } from './employee-invitation.service';

const preview: InvitationPreview = {
  firstName: 'Nora',
  lastName: 'Test',
  email: 'nora@example.com',
  role: 'EMPLOYEE',
  companyName: 'Boulangerie Martin',
  expiresAt: '2026-09-30T20:00:00.000Z',
};

interface Setup {
  authenticated: boolean;
  getInvitation?: () => Observable<InvitationPreview>;
}

async function render({ authenticated, getInvitation = () => of(preview) }: Setup) {
  const auth = {
    authenticated: signal(authenticated).asReadonly(),
    register: jasmine.createSpy('register').and.resolveTo(),
    login: jasmine.createSpy('login').and.resolveTo(),
    logout: jasmine.createSpy('logout').and.resolveTo(),
    email: () => null,
  };
  const invitations = {
    getInvitation: jasmine.createSpy('getInvitation').and.callFake(getInvitation),
    acceptInvitation: jasmine.createSpy('acceptInvitation').and.returnValue(of({})),
  };

  await TestBed.configureTestingModule({
    imports: [EmployeeInvitation],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: AuthService, useValue: auth },
      { provide: EmployeeInvitationService, useValue: invitations },
      { provide: CurrentUserService, useValue: { getCurrentUser: () => throwError(() => null) } },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ token: 'a-token' }) } },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(EmployeeInvitation);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const button = (label: string) =>
    Array.from(element.querySelectorAll('button')).find(
      (item) => item.textContent?.trim() === label,
    );
  return { auth, invitations, element, button };
}

describe('EmployeeInvitation page', () => {
  it('welcomes an invited person without account and only asks them to choose a password', async () => {
    const { auth, invitations, element, button } = await render({ authenticated: false });

    expect(element.textContent).toContain('Bonjour Nora.');
    expect(element.textContent).toContain('Boulangerie Martin');
    expect(element.textContent).toContain('nora@example.com');
    expect(invitations.acceptInvitation).not.toHaveBeenCalled();

    button('Créer mon mot de passe')?.click();
    expect(auth.register).toHaveBeenCalledWith('nora@example.com');

    button('J’ai déjà un compte')?.click();
    expect(auth.login).toHaveBeenCalledWith('nora@example.com');
  });

  it('joins the company directly once signed in', async () => {
    const { invitations } = await render({ authenticated: true });

    expect(invitations.acceptInvitation).toHaveBeenCalledWith('a-token');
    expect(invitations.getInvitation).not.toHaveBeenCalled();
  });

  it('never sends someone to create a password with an expired or replaced link', async () => {
    const { element, button } = await render({
      authenticated: false,
      getInvitation: () => throwError(() => new HttpErrorResponse({ status: 410 })),
    });

    expect(element.textContent).toContain('Demandez un nouveau lien');
    expect(button('Créer mon mot de passe')).toBeUndefined();
  });
});
