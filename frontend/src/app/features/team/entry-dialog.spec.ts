import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject, of, throwError } from 'rxjs';

import { apiErrorMessage } from '../../core/http/error-message';
import { TimeEntry, TimesheetEntry } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { EntryDialog, EntryDialogData } from './entry-dialog';

/** Clocked from 08:00 to 12:00 in Paris. */
const ENTRY: TimesheetEntry = {
  id: 'entry-1',
  startAt: '2026-09-21T06:00:00.000Z',
  endAt: '2026-09-21T10:00:00.000Z',
  durationMinutes: 240,
  source: 'CLOCK',
  note: null,
  isOpen: false,
  isCorrected: false,
};

function overlap(): HttpErrorResponse {
  return new HttpErrorResponse({
    status: 409,
    error: { statusCode: 409, message: 'This period overlaps another time entry of the employee' },
  });
}

describe('EntryDialog', () => {
  let timeService: jasmine.SpyObj<TimeService>;

  beforeEach(() => {
    timeService = jasmine.createSpyObj<TimeService>('TimeService', [
      'createEntry',
      'updateEntry',
      'deleteEntry',
    ]);
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TimeService, useValue: timeService }],
    });
  });

  /** Opens the dialog like the timesheet page does, and drives it through the DOM. */
  function open(data: Partial<EntryDialogData> = {}) {
    const ref = TestBed.inject(MatDialog).open<EntryDialog, EntryDialogData, boolean>(EntryDialog, {
      data: {
        mode: 'edit',
        employeeId: 'employee-1',
        employeeName: 'Emma Martin',
        date: '2026-09-21',
        timezone: 'Europe/Paris',
        entry: ENTRY,
        ...data,
      },
    });
    const closed = jasmine.createSpy('closed');
    ref.afterClosed().subscribe(closed);

    const settle = async () => {
      TestBed.inject(ApplicationRef).tick();
      await new Promise((resolve) => setTimeout(resolve));
      TestBed.inject(ApplicationRef).tick();
    };
    const dialog = () => document.querySelector<HTMLElement>('app-entry-dialog');
    const field = (name: string) =>
      dialog()!.querySelector<HTMLInputElement>(`input[formcontrolname="${name}"]`)!;
    const type = (name: string, value: string) => {
      field(name).value = value;
      field(name).dispatchEvent(new Event('input'));
    };
    const submit = () =>
      dialog()!.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    const errors = () =>
      Array.from(dialog()!.querySelectorAll('mat-error')).map((error) => error.textContent?.trim());

    return { closed, settle, dialog, field, type, submit, errors };
  }

  it('stays open with the refusal of the API inside, and keeps what was typed', async () => {
    timeService.updateEntry.and.returnValue(throwError(() => overlap()));
    const { closed, settle, dialog, field, type, submit } = open();
    await settle();

    type('end', '13:00');
    type('reason', 'Oubli de sortie');
    submit();
    await settle();

    expect(timeService.updateEntry).toHaveBeenCalledOnceWith('entry-1', {
      endAt: '2026-09-21T11:00:00.000Z',
      reason: 'Oubli de sortie',
    });
    expect(closed).not.toHaveBeenCalled();
    expect(dialog()?.querySelector('[role="alert"]')?.textContent).toContain(
      apiErrorMessage(overlap()),
    );
    expect(field('end').value).toBe('13:00');
    expect(field('reason').value).toBe('Oubli de sortie');

    // Fixed on the other side: the same dialog saves on the next attempt.
    timeService.updateEntry.and.returnValue(of({} as TimeEntry));
    submit();
    await settle();

    expect(timeService.updateEntry).toHaveBeenCalledTimes(2);
    expect(closed).toHaveBeenCalledOnceWith(true);
  });

  it('sends a single request while the change is being saved', async () => {
    const response = new Subject<TimeEntry>();
    timeService.updateEntry.and.returnValue(response);
    const { closed, settle, dialog, type, submit } = open();
    await settle();

    type('end', '13:00');
    type('reason', 'Oubli de sortie');
    submit();
    await settle();
    submit();
    await settle();

    expect(timeService.updateEntry).toHaveBeenCalledTimes(1);
    expect(dialog()?.querySelector('button[type="submit"]')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(closed).not.toHaveBeenCalled();

    response.next({} as TimeEntry);
    response.complete();
    await settle();

    expect(closed).toHaveBeenCalledOnceWith(true);
  });

  it('shows a single message for a missing end time, and sends nothing', async () => {
    const { settle, type, submit, errors } = open({ mode: 'create', entry: undefined });
    await settle();

    type('start', '08:00');
    type('reason', 'Oubli de pointage');
    submit();
    await settle();

    expect(errors()).toEqual(['L’heure de fin est obligatoire.']);
    expect(timeService.createEntry).not.toHaveBeenCalled();
  });

  it('creates the period for the employee, ending on the next day for a night shift', async () => {
    timeService.createEntry.and.returnValue(of({} as TimeEntry));
    const { closed, settle, type, submit } = open({ mode: 'create', entry: undefined });
    await settle();

    type('start', '22:00');
    type('end', '06:00');
    type('reason', 'Inventaire de nuit');
    submit();
    await settle();

    expect(timeService.createEntry).toHaveBeenCalledOnceWith({
      userId: 'employee-1',
      startAt: '2026-09-21T20:00:00.000Z',
      endAt: '2026-09-22T04:00:00.000Z',
      note: undefined,
      reason: 'Inventaire de nuit',
    });
    expect(closed).toHaveBeenCalledOnceWith(true);
  });

  it('deletes the period with the reason given', async () => {
    timeService.deleteEntry.and.returnValue(of(undefined));
    const { closed, settle, type, submit } = open({ mode: 'delete' });
    await settle();

    type('reason', 'Doublon');
    submit();
    await settle();

    expect(timeService.deleteEntry).toHaveBeenCalledOnceWith('entry-1', 'Doublon');
    expect(closed).toHaveBeenCalledOnceWith(true);
  });
});
