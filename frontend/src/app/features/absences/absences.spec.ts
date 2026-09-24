import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject, of, throwError } from 'rxjs';

import { CurrentUser, UserRole } from '../../core/auth/auth.models';
import { addDays, todayKey } from '../../core/time/time-format';
import { CurrentUserService } from '../../core/user/current-user.service';
import { Absences } from './absences';
import { AbsenceRequest, AbsencesService } from './absences.service';

function user(role: UserRole): CurrentUser {
  return {
    id: role === 'EMPLOYEE' ? 'employee-1' : 'manager-1',
    subject: 'subject-1',
    email: null,
    firstName: 'Karim',
    lastName: 'Benali',
    isActive: true,
    role,
    weeklyContractMinutes: 2100,
    company: { id: 'company-1', name: 'Boulangerie Martin', timezone: 'Europe/Paris' },
  };
}

/** Five days of paid leave in two weeks, requested by Emma Martin. */
function absence(overrides: Partial<AbsenceRequest> = {}): AbsenceRequest {
  const start = addDays(todayKey('Europe/Paris'), 14);
  return {
    id: 'absence-1',
    employee: { id: 'employee-1', firstName: 'Emma', lastName: 'Martin' },
    type: 'PAID_LEAVE',
    status: 'PENDING',
    startDate: start,
    endDate: addDays(start, 4),
    startsAfternoon: false,
    endsMorning: false,
    days: 5,
    comment: null,
    reviewComment: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: '2026-09-01T08:00:00.000Z',
    ...overrides,
  };
}

describe('Absences', () => {
  let service: jasmine.SpyObj<AbsencesService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    // A real snack bar keeps a 4-second timer that whenStable() would wait for.
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    service = jasmine.createSpyObj<AbsencesService>('AbsencesService', [
      'listMine',
      'listTeam',
      'create',
      'cancel',
      'approve',
      'reject',
      'revoke',
    ]);
    service.listMine.and.returnValue(of([]));
    service.listTeam.and.returnValue(of([]));
  });

  async function render(role: UserRole): Promise<ComponentFixture<Absences>> {
    TestBed.configureTestingModule({
      imports: [Absences],
      providers: [
        provideNoopAnimations(),
        { provide: AbsencesService, useValue: service },
        { provide: CurrentUserService, useValue: { getCurrentUser: () => of(user(role)) } },
      ],
    });
    // Also replaces the snack bar provided by MatSnackBarModule in the component's imports.
    TestBed.overrideProvider(MatSnackBar, { useValue: snackBar });
    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(Absences);
    await settle(fixture);
    return fixture;
  }

  /** Renders the page and the dialogs, and lets them open or close. */
  async function settle(fixture: ComponentFixture<Absences>): Promise<void> {
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    await fixture.whenStable();
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
  }

  function tab(fixture: ComponentFixture<Absences>, label: string): HTMLElement {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]'),
    ).find((element) => element.textContent?.includes(label))!;
  }

  function activeTab(fixture: ComponentFixture<Absences>): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector('.mat-mdc-tab-body-active')!;
  }

  function button(root: ParentNode, label: string): HTMLButtonElement {
    return Array.from(root.querySelectorAll('button')).find(
      (element) => element.textContent?.trim() === label,
    )!;
  }

  function confirmation(): HTMLElement | null {
    return document.querySelector('app-confirm-dialog');
  }

  it('never says that nothing is waiting while the team requests load or after a failure', async () => {
    const teamRequests = new Subject<AbsenceRequest[]>();
    service.listTeam.and.returnValue(teamRequests);
    const fixture = await render('MANAGER');

    tab(fixture, 'À valider').click();
    await settle(fixture);

    expect(tab(fixture, 'À valider').textContent?.trim()).toBe('À valider');
    expect(activeTab(fixture).querySelector('[role="status"]')).not.toBeNull();
    expect(activeTab(fixture).textContent).not.toContain('Tout est à jour');

    teamRequests.error(new HttpErrorResponse({ status: 503 }));
    await settle(fixture);

    expect(activeTab(fixture).querySelector('[role="alert"]')?.textContent?.trim()).toBeTruthy();
    expect(activeTab(fixture).textContent).not.toContain('Tout est à jour');

    service.listTeam.and.returnValue(of([absence()]));
    button(activeTab(fixture), 'Réessayer').click();
    await settle(fixture);

    expect(service.listTeam).toHaveBeenCalledTimes(4);
    expect(activeTab(fixture).textContent).toContain('Emma Martin');
    expect(tab(fixture, 'À valider').textContent).toContain('À valider (1)');
  });

  it('shows why my requests could not be loaded, and loads them again', async () => {
    service.listMine.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 500 })),
      of([absence()]),
    );
    const fixture = await render('EMPLOYEE');
    const element = fixture.nativeElement as HTMLElement;

    const mine = element.querySelector('section[aria-labelledby="mine-title"]')!;
    expect(mine.querySelector('[role="alert"]')?.textContent?.trim()).toBeTruthy();
    expect(mine.textContent).not.toContain('Aucune demande pour l’instant.');

    button(mine, 'Réessayer').click();
    await settle(fixture);

    expect(service.listMine).toHaveBeenCalledTimes(2);
    expect(mine.querySelector('.requests')?.textContent).toContain('Congés payés');
  });

  it('asks before refusing a request, and does nothing when the manager goes back', async () => {
    service.listTeam.and.returnValue(of([absence()]));
    service.reject.and.returnValue(of(absence({ status: 'REJECTED' })));
    const fixture = await render('MANAGER');
    tab(fixture, 'À valider').click();
    await settle(fixture);

    button(activeTab(fixture), 'Refuser').click();
    await settle(fixture);
    expect(confirmation()?.textContent).toContain('Emma Martin');

    button(confirmation()!, 'Retour').click();
    await settle(fixture);
    expect(confirmation()).toBeNull();
    expect(service.reject).not.toHaveBeenCalled();

    button(activeTab(fixture), 'Refuser').click();
    await settle(fixture);
    button(confirmation()!, 'Refuser la demande').click();
    await settle(fixture);

    expect(service.reject).toHaveBeenCalledOnceWith('absence-1', undefined);
    expect(snackBar.open).toHaveBeenCalledWith('Absence de Emma Martin refusée.', 'OK', {
      duration: 4000,
    });
  });

  it('warns that an accepted absence would have to be requested again before cancelling it', async () => {
    const manager = { id: 'manager-1', firstName: 'Karim', lastName: 'Benali' };
    service.listMine.and.returnValue(of([absence({ status: 'APPROVED', reviewedBy: manager })]));
    service.cancel.and.returnValue(of(absence({ status: 'CANCELLED' })));
    const fixture = await render('EMPLOYEE');

    button(fixture.nativeElement as HTMLElement, 'Annuler la demande').click();
    await settle(fixture);
    expect(confirmation()?.textContent).toContain('déjà été acceptée');

    button(confirmation()!, 'Annuler l’absence').click();
    await settle(fixture);

    expect(service.cancel).toHaveBeenCalledOnceWith('absence-1');
    expect(snackBar.open).toHaveBeenCalledWith('Demande annulée.', 'OK', { duration: 4000 });
  });
});
