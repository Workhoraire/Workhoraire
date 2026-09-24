import { HttpErrorResponse } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CurrentUser } from '../../core/auth/auth.models';
import { addDays, localDateTimeToIso, startOfWeek, todayKey } from '../../core/time/time-format';
import { EmployeeTimesheet, TimesheetEntry } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { TimesheetDays } from '../../shared/timesheet/timesheet-days';
import { EmployeeTimesheetPage } from './employee-timesheet';

const PARIS = 'Europe/Paris';
const THIS_WEEK = startOfWeek(todayKey(PARIS));
const LAST_WEEK = addDays(THIS_WEEK, -7);

const ADMIN: CurrentUser = {
  id: 'admin-1',
  subject: 'subject-1',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Durand',
  isActive: true,
  role: 'ADMIN',
  weeklyContractMinutes: 2100,
  company: { id: 'company-1', name: 'Boulangerie Martin', timezone: PARIS },
};

/** 08:00 to 12:00 on the Monday of the week. */
function morning(weekStart: string): TimesheetEntry {
  return {
    id: 'entry-1',
    startAt: localDateTimeToIso(weekStart, '08:00', PARIS),
    endAt: localDateTimeToIso(weekStart, '12:00', PARIS),
    durationMinutes: 240,
    source: 'CLOCK',
    note: null,
    isOpen: false,
    isCorrected: false,
  };
}

function sheet(weekStart: string, entries: TimesheetEntry[] = []): EmployeeTimesheet {
  const worked = entries.reduce((total, entry) => total + entry.durationMinutes, 0);
  return {
    from: weekStart,
    to: addDays(weekStart, 6),
    timezone: PARIS,
    contractMinutes: 2100,
    employee: {
      id: 'employee-1',
      firstName: 'Emma',
      lastName: 'Martin',
      email: null,
      role: 'EMPLOYEE',
      isActive: true,
      weeklyContractMinutes: 2100,
    },
    days: Array.from({ length: 7 }, (_, index) => ({
      date: addDays(weekStart, index),
      weekday: index + 1,
      publicHoliday: null,
      entries: index === 0 ? entries : [],
      workedMinutes: index === 0 ? worked : 0,
      breakMinutes: 0,
      firstStartAt: null,
      lastEndAt: null,
      absences: [],
      alerts: [],
    })),
    weeks: [
      {
        weekStart,
        weekEnd: addDays(weekStart, 6),
        withinPeriod: true,
        workedMinutes: worked,
        contractMinutes: 2100,
        workingDays: entries.length > 0 ? 1 : 0,
        paidLeaveCreditMinutes: 0,
        overtime: { tier25Minutes: 0, tier50Minutes: 0 },
        complementary: { tier10Minutes: 0, tier25Minutes: 0 },
        absenceDays: 0,
        alerts: [],
      },
    ],
    totals: { workedMinutes: worked, absenceDays: 0, alertCount: 0 },
  };
}

describe('EmployeeTimesheetPage', () => {
  let timeService: jasmine.SpyObj<TimeService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    // A real snack bar keeps a 4-second timer that whenStable() would wait for.
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    timeService = jasmine.createSpyObj<TimeService>('TimeService', [
      'getEmployeeTimesheet',
      'getAuditLogs',
      'deleteEntry',
    ]);
    timeService.getAuditLogs.and.returnValue(of([]));
  });

  async function render(): Promise<ComponentFixture<EmployeeTimesheetPage>> {
    TestBed.configureTestingModule({
      imports: [EmployeeTimesheetPage],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideNoopAnimations(),
        { provide: TimeService, useValue: timeService },
        { provide: CurrentUserService, useValue: { getCurrentUser: () => of(ADMIN) } },
      ],
    });
    // Also replaces the snack bar provided by MatSnackBarModule in the component's imports.
    TestBed.overrideProvider(MatSnackBar, { useValue: snackBar });
    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(EmployeeTimesheetPage);
    fixture.componentRef.setInput('employeeId', 'employee-1');
    await settle(fixture);
    return fixture;
  }

  async function settle(fixture: ComponentFixture<EmployeeTimesheetPage>): Promise<void> {
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    await fixture.whenStable();
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
  }

  function button(root: ParentNode, label: string): HTMLButtonElement {
    return Array.from(root.querySelectorAll('button')).find(
      (element) =>
        element.getAttribute('aria-label') === label || element.textContent?.trim() === label,
    )!;
  }

  it('never shows the hours of another week under the dates of a week that failed to load', async () => {
    timeService.getEmployeeTimesheet.and.returnValues(
      of(sheet(THIS_WEEK, [morning(THIS_WEEK)])),
      throwError(() => new HttpErrorResponse({ status: 500 })),
      of(sheet(LAST_WEEK)),
    );
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-timesheet-days')).not.toBeNull();

    button(element, 'Semaine précédente').click();
    await settle(fixture);

    expect(timeService.getEmployeeTimesheet.calls.mostRecent().args).toEqual([
      'employee-1',
      LAST_WEEK,
      addDays(LAST_WEEK, 6),
    ]);
    expect(element.querySelector('app-timesheet-days')).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBeTruthy();
    // The header still says whose timesheet it is.
    expect(element.querySelector('h1')?.textContent).toContain('Emma Martin');

    button(element, 'Réessayer').click();
    await settle(fixture);

    expect(timeService.getEmployeeTimesheet).toHaveBeenCalledTimes(3);
    expect(timeService.getEmployeeTimesheet.calls.mostRecent().args[1]).toBe(LAST_WEEK);
    expect(element.querySelector('app-timesheet-days')).not.toBeNull();
    expect(element.querySelector('[role="alert"]')).toBeNull();
    // The team page opens on the same week.
    expect(element.querySelector('a.back')?.getAttribute('href')).toBe(
      `/team?semaine=${LAST_WEEK}`,
    );
  });

  it('moves the focus to the day of a deleted period', async () => {
    const focusDay = spyOn(TimesheetDays.prototype, 'focusDay').and.callThrough();
    timeService.getEmployeeTimesheet.and.returnValues(
      of(sheet(THIS_WEEK, [morning(THIS_WEEK)])),
      of(sheet(THIS_WEEK)),
    );
    timeService.deleteEntry.and.returnValue(of(undefined));
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;

    button(element, 'Supprimer cette période').click();
    await settle(fixture);
    const dialog = document.querySelector('app-entry-dialog')!;
    const reason = dialog.querySelector<HTMLInputElement>('input[formcontrolname="reason"]')!;
    reason.value = 'Doublon';
    reason.dispatchEvent(new Event('input'));
    dialog.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await settle(fixture);

    expect(timeService.deleteEntry).toHaveBeenCalledOnceWith('entry-1', 'Doublon');
    expect(snackBar.open).toHaveBeenCalledWith('Période supprimée et tracée.', 'OK', {
      duration: 4000,
    });
    expect(focusDay).toHaveBeenCalledWith(THIS_WEEK);
    const focused = document.activeElement as HTMLElement;
    expect(focused.textContent).toContain('Ajouter une période');
    expect(focused.closest('[data-date]')?.getAttribute('data-date')).toBe(THIS_WEEK);
  });
});
