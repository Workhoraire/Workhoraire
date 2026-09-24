import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { ClockStatus, TimeEntry } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { Clock } from './clock';

function status(): ClockStatus {
  const day = {
    date: '2026-09-24',
    weekday: 4,
    publicHoliday: null,
    entries: [],
    workedMinutes: 0,
    breakMinutes: 0,
    firstStartAt: null,
    lastEndAt: null,
    absences: [],
    alerts: [],
  };
  return {
    serverTime: new Date().toISOString(),
    timezone: 'Europe/Paris',
    openEntry: null,
    today: { ...day, date: new Date().toISOString().slice(0, 10) },
    week: {
      weekStart: '2026-09-21',
      weekEnd: '2026-09-27',
      withinPeriod: true,
      workedMinutes: 0,
      contractMinutes: 2100,
      workingDays: 0,
      paidLeaveCreditMinutes: 0,
      overtime: { tier25Minutes: 0, tier50Minutes: 0 },
      complementary: { tier10Minutes: 0, tier25Minutes: 0 },
      absenceDays: 0,
      alerts: [],
    },
    weekDays: [],
  };
}

describe('Clock', () => {
  let clockIn: jasmine.Spy<() => Observable<TimeEntry>>;

  beforeEach(async () => {
    clockIn = jasmine.createSpy('clockIn');
    await TestBed.configureTestingModule({
      imports: [Clock],
      providers: [
        provideRouter([]),
        { provide: TimeService, useValue: { getClockStatus: () => of(status()), clockIn } },
        { provide: CurrentUserService, useValue: { getCurrentUser: () => of(null) } },
      ],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(Clock);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('keeps the error of a failed clock-in after reloading the day', () => {
    clockIn.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'boom' } })),
    );
    const fixture = TestBed.createComponent(Clock);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.clock-button')!
      .click();
    fixture.detectChanges();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Une erreur est survenue');
  });

  it('ignores a second click while the first clock-in is running', () => {
    const pending = new Subject<TimeEntry>();
    clockIn.and.returnValue(pending);
    const element = render();

    const button = element.querySelector<HTMLButtonElement>('.clock-button')!;
    button.click();
    button.click();

    expect(clockIn).toHaveBeenCalledTimes(1);
  });
});
