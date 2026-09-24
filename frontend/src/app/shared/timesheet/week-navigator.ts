import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { addDays, formatWeekRange } from '../../core/time/time-format';

@Component({
  selector: 'app-week-navigator',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="wh-week-nav" role="group" aria-label="Choix de la semaine">
      <button
        mat-icon-button
        type="button"
        matTooltip="Semaine précédente"
        aria-label="Semaine précédente"
        (click)="weekChange.emit(previous())"
      >
        <mat-icon aria-hidden="true">chevron_left</mat-icon>
      </button>
      <span class="wh-week-label" aria-live="polite">{{ label() }}</span>
      <button
        mat-icon-button
        type="button"
        matTooltip="Semaine suivante"
        aria-label="Semaine suivante"
        disabledInteractive
        [disabled]="isCurrent()"
        (click)="goTo(next())"
      >
        <mat-icon aria-hidden="true">chevron_right</mat-icon>
      </button>
      <button
        mat-button
        type="button"
        disabledInteractive
        [disabled]="isCurrent()"
        (click)="goTo(currentWeekStart())"
      >
        Cette semaine
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekNavigator {
  readonly weekStart = input.required<string>();
  readonly currentWeekStart = input.required<string>();
  readonly weekChange = output<string>();

  protected readonly label = computed(() => formatWeekRange(this.weekStart()));
  protected readonly previous = computed(() => addDays(this.weekStart(), -7));
  protected readonly next = computed(() => addDays(this.weekStart(), 7));
  protected readonly isCurrent = computed(() => this.weekStart() >= this.currentWeekStart());

  /** Disabled buttons stay focusable (disabledInteractive) and still receive clicks. */
  protected goTo(weekStart: string): void {
    if (!this.isCurrent()) {
      this.weekChange.emit(weekStart);
    }
  }
}
