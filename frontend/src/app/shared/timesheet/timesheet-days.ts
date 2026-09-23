import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ABSENCE_TYPE_LABELS, describeAlert } from '../../core/time/labels';
import { formatDayLabel, formatDuration, formatTime } from '../../core/time/time-format';
import { TimesheetDay, TimesheetEntry } from '../../core/time/time.models';

export interface EntryAction {
  day: TimesheetDay;
  entry: TimesheetEntry;
}

@Component({
  selector: 'app-timesheet-days',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './timesheet-days.html',
  styleUrl: './timesheet-days.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDays {
  readonly days = input.required<TimesheetDay[]>();
  readonly timezone = input.required<string>();
  readonly today = input<string | null>(null);
  /** Shows the correction actions (managers and administrators). */
  readonly editable = input(false);

  readonly addEntry = output<TimesheetDay>();
  readonly editEntry = output<EntryAction>();
  readonly deleteEntry = output<EntryAction>();

  protected readonly formatDayLabel = formatDayLabel;
  protected readonly formatDuration = formatDuration;
  protected readonly formatTime = formatTime;
  protected readonly describeAlert = describeAlert;
  protected readonly absenceLabels = ABSENCE_TYPE_LABELS;

  protected isQuiet(day: TimesheetDay): boolean {
    return (
      day.entries.length === 0 &&
      day.absences.length === 0 &&
      day.alerts.length === 0 &&
      day.publicHoliday === null
    );
  }
}
