import { HttpErrorResponse } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { CurrentUser, UserRole } from '../../core/auth/auth.models';
import { describeAlert } from '../../core/time/labels';
import { addDays, startOfWeek, todayKey } from '../../core/time/time-format';
import { ComplianceAlert, TeamTimesheet } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { Team } from './team';

const PARIS = 'Europe/Paris';
const THIS_WEEK = startOfWeek(todayKey(PARIS));
const LAST_WEEK = addDays(THIS_WEEK, -7);

function user(role: UserRole): CurrentUser {
  return {
    id: 'user-1',
    subject: 'subject-1',
    email: 'karim@example.com',
    firstName: 'Karim',
    lastName: 'Benali',
    isActive: true,
    role,
    weeklyContractMinutes: 2100,
    company: { id: 'company-1', name: 'Boulangerie Martin', timezone: PARIS },
  };
}

interface SheetOptions {
  /** Minutes worked on the Monday. */
  worked?: number;
  /** Alert on the Tuesday. */
  alert?: ComplianceAlert;
  /** Public holiday on the Monday. */
  holiday?: string;
  empty?: boolean;
}

function teamSheet(weekStart: string, options: SheetOptions = {}): TeamTimesheet {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const worked = options.worked ?? 0;
  return {
    from: weekStart,
    to: dates[6],
    timezone: PARIS,
    publicHolidays: options.holiday ? [{ date: dates[0], name: options.holiday }] : [],
    rows: options.empty
      ? []
      : [
          {
            employee: {
              id: 'employee-1',
              firstName: 'Emma',
              lastName: 'Martin',
              email: null,
              role: 'EMPLOYEE',
              isActive: true,
              weeklyContractMinutes: 2100,
            },
            days: dates.map((date, index) => ({
              date,
              workedMinutes: index === 0 ? worked : 0,
              breakMinutes: 0,
              firstStartAt: null,
              lastEndAt: null,
              absences: [],
              hasOpenEntry: false,
              alerts: index === 1 && options.alert ? [options.alert] : [],
            })),
            weeks: [
              {
                weekStart,
                weekEnd: dates[6],
                withinPeriod: true,
                workedMinutes: worked,
                contractMinutes: 2100,
                workingDays: worked > 0 ? 1 : 0,
                paidLeaveCreditMinutes: 0,
                overtime: { tier25Minutes: 0, tier50Minutes: 0 },
                complementary: { tier10Minutes: 0, tier25Minutes: 0 },
                absenceDays: 0,
                alerts: [],
              },
            ],
            totals: { workedMinutes: worked, absenceDays: 0, alertCount: options.alert ? 1 : 0 },
          },
        ],
  };
}

describe('Team', () => {
  let getTeamTimesheet: jasmine.Spy;

  beforeEach(() => {
    getTeamTimesheet = jasmine.createSpy('getTeamTimesheet');
  });

  function configure(role: UserRole = 'MANAGER'): void {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'team', component: Team }]),
        provideLocationMocks(),
        provideNoopAnimations(),
        { provide: TimeService, useValue: { getTeamTimesheet } },
        { provide: CurrentUserService, useValue: { getCurrentUser: () => of(user(role)) } },
      ],
    });
  }

  async function render(role: UserRole = 'MANAGER'): Promise<ComponentFixture<Team>> {
    configure(role);
    const fixture = TestBed.createComponent(Team);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  function button(root: ParentNode, label: string): HTMLButtonElement {
    return Array.from(root.querySelectorAll('button')).find(
      (element) =>
        element.getAttribute('aria-label') === label || element.textContent?.trim() === label,
    )!;
  }

  it('never shows the hours of another week under the dates of a week that failed to load', async () => {
    getTeamTimesheet.and.returnValues(
      of(teamSheet(THIS_WEEK, { worked: 450 })),
      throwError(() => new HttpErrorResponse({ status: 500 })),
      of(teamSheet(LAST_WEEK, { worked: 300 })),
    );
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('tbody')?.textContent).toContain('7 h 30');

    button(element, 'Semaine précédente').click();
    fixture.detectChanges();

    expect(getTeamTimesheet).toHaveBeenCalledWith(LAST_WEEK, addDays(LAST_WEEK, 6));
    expect(element.querySelector('table')).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBeTruthy();

    button(element, 'Réessayer').click();
    fixture.detectChanges();

    expect(getTeamTimesheet).toHaveBeenCalledTimes(3);
    expect(getTeamTimesheet.calls.mostRecent().args).toEqual([LAST_WEEK, addDays(LAST_WEEK, 6)]);
    expect(element.querySelector('tbody')?.textContent).toContain('5 h');
    expect(element.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows the alerts of an employee below the row, not only in a tooltip', async () => {
    const alert: ComplianceAlert = {
      code: 'MISSING_BREAK',
      date: addDays(THIS_WEEK, 1),
      scope: 'DAY',
      value: 0,
      limit: 20,
    };
    getTeamTimesheet.and.returnValue(of(teamSheet(THIS_WEEK, { worked: 420, alert })));
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLButtonElement>('button.alert-count')!;
    const details = element.querySelector<HTMLTableRowElement>('tr.alert-row')!;

    expect(toggle.getAttribute('aria-controls')).toBe(details.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(details.hidden).toBeTrue();

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(details.hidden).toBeFalse();
    expect(details.textContent).toContain(describeAlert(alert));
  });

  it('writes out the public holidays and explains every abbreviation', async () => {
    getTeamTimesheet.and.returnValue(of(teamSheet(THIS_WEEK, { holiday: 'Toussaint' })));
    const element = (await render()).nativeElement as HTMLElement;

    expect(element.querySelector('thead')?.textContent).toContain('Toussaint');
    expect(element.querySelector('.legend')?.textContent).toContain('Abs.');
  });

  it('only sends administrators to the page of the employees, which managers cannot open', async () => {
    getTeamTimesheet.and.returnValue(of(teamSheet(THIS_WEEK, { empty: true })));
    let element = (await render('MANAGER')).nativeElement as HTMLElement;
    expect(element.querySelector('a[href="/employees"]')).toBeNull();
    expect(element.querySelector('a[href="/dashboard"]')).not.toBeNull();

    TestBed.resetTestingModule();
    element = (await render('ADMIN')).nativeElement as HTMLElement;
    expect(element.querySelector('a[href="/employees"]')).not.toBeNull();
  });

  it('opens the week given in the address and carries it to the timesheets', async () => {
    getTeamTimesheet.and.returnValue(of(teamSheet(LAST_WEEK, { worked: 300 })));
    configure();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/team?semaine=${LAST_WEEK}`, Team);
    harness.detectChanges();

    expect(getTeamTimesheet).toHaveBeenCalledWith(LAST_WEEK, addDays(LAST_WEEK, 6));
    expect(harness.routeNativeElement?.querySelector('tbody a')?.getAttribute('href')).toBe(
      `/team/employee-1?semaine=${LAST_WEEK}`,
    );
  });
});
