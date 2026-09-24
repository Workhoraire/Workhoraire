import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TimesheetDay, TimesheetEntry } from '../../core/time/time.models';
import { TimesheetDays } from './timesheet-days';

function entry(overrides: Partial<TimesheetEntry> = {}): TimesheetEntry {
  return {
    id: 'morning',
    // 08:00 to 12:00 in Paris.
    startAt: '2026-09-21T06:00:00.000Z',
    endAt: '2026-09-21T10:00:00.000Z',
    durationMinutes: 240,
    source: 'CLOCK',
    note: null,
    isOpen: false,
    isCorrected: false,
    ...overrides,
  };
}

function day(date: string, entries: TimesheetEntry[] = []): TimesheetDay {
  return {
    date,
    weekday: 1,
    publicHoliday: null,
    entries,
    workedMinutes: entries.reduce((total, item) => total + item.durationMinutes, 0),
    breakMinutes: 0,
    firstStartAt: null,
    lastEndAt: null,
    absences: [],
    alerts: [],
  };
}

async function render(days: TimesheetDay[], editable: boolean) {
  await TestBed.configureTestingModule({
    imports: [TimesheetDays],
    providers: [provideNoopAnimations()],
  }).compileComponents();

  const fixture = TestBed.createComponent(TimesheetDays);
  fixture.componentRef.setInput('days', days);
  fixture.componentRef.setInput('timezone', 'Europe/Paris');
  fixture.componentRef.setInput('editable', editable);
  fixture.detectChanges();
  return fixture;
}

describe('TimesheetDays', () => {
  it('marks a period that ends on the next day', async () => {
    const night = entry({
      id: 'night',
      // 22:00 to 06:00 the next morning, in Paris.
      startAt: '2026-09-21T20:00:00.000Z',
      endAt: '2026-09-22T04:00:00.000Z',
      durationMinutes: 480,
    });
    const fixture = await render([day('2026-09-21', [entry(), night])], false);

    const times = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.entry-times'),
    ).map((element) => element.textContent?.replace(/\s+/g, ' ').trim());

    expect(times).toEqual(['08:00 – 12:00', '22:00 – 06:00 (lendemain)']);
  });

  it('gives the focus back to the day of a deleted period', async () => {
    const fixture = await render([day('2026-09-21'), day('2026-09-22')], true);

    fixture.componentInstance.focusDay('2026-09-22');

    const focused = document.activeElement as HTMLElement;
    expect(focused.textContent).toContain('Ajouter une période');
    expect(focused.closest('[data-date]')?.getAttribute('data-date')).toBe('2026-09-22');
  });

  it('falls back on the day heading when the day cannot be edited', async () => {
    const fixture = await render([day('2026-09-21'), day('2026-09-22')], false);

    fixture.componentInstance.focusDay('2026-09-21');

    const focused = document.activeElement as HTMLElement;
    expect(focused.classList).toContain('day-name');
    expect(focused.closest('[data-date]')?.getAttribute('data-date')).toBe('2026-09-21');
  });
});
