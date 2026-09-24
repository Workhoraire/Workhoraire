import { TestBed } from '@angular/core/testing';

import { WeekNavigator } from './week-navigator';

describe('WeekNavigator', () => {
  function render(weekStart: string, currentWeekStart: string) {
    const fixture = TestBed.createComponent(WeekNavigator);
    fixture.componentRef.setInput('weekStart', weekStart);
    fixture.componentRef.setInput('currentWeekStart', currentWeekStart);
    const emitted: string[] = [];
    fixture.componentInstance.weekChange.subscribe((week) => emitted.push(week));
    fixture.detectChanges();
    return { element: fixture.nativeElement as HTMLElement, emitted };
  }

  function button(element: HTMLElement, label: string): HTMLButtonElement {
    return [...element.querySelectorAll('button')].find(
      (item) => item.getAttribute('aria-label') === label || item.textContent?.includes(label),
    )!;
  }

  it('does not go past the current week, although the greyed buttons keep the focus', () => {
    const { element, emitted } = render('2026-09-21', '2026-09-21');

    button(element, 'Semaine suivante').click();
    button(element, 'Cette semaine').click();

    expect(emitted).toEqual([]);
  });

  it('moves to the previous week, then back to the current one', () => {
    const { element, emitted } = render('2026-09-14', '2026-09-21');

    button(element, 'Semaine précédente').click();
    button(element, 'Semaine suivante').click();
    button(element, 'Cette semaine').click();

    expect(emitted).toEqual(['2026-09-07', '2026-09-21', '2026-09-21']);
  });
});
