import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { apiErrorMessage } from '../../core/http/error-message';
import { ABSENCE_TYPE_LABELS, describeAlert } from '../../core/time/labels';
import {
  addDays,
  formatDuration,
  formatWeekdayShort,
  fullName,
  startOfWeek,
  todayKey,
} from '../../core/time/time-format';
import {
  AbsenceType,
  TeamTimesheet,
  TeamTimesheetRow,
  complementaryMinutes,
  overtimeMinutes,
} from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { WeekNavigator } from '../../shared/timesheet/week-navigator';

@Component({
  selector: 'app-team',
  imports: [MatIconModule, MatProgressSpinnerModule, MatTooltipModule, RouterLink, WeekNavigator],
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team {
  private readonly timeService = inject(TimeService);
  private readonly currentUserService = inject(CurrentUserService);

  private readonly timezone = signal('Europe/Paris');
  protected readonly today = computed(() => todayKey(this.timezone()));
  protected readonly currentWeekStart = computed(() => startOfWeek(this.today()));
  protected readonly weekStart = signal(startOfWeek(todayKey('Europe/Paris')));

  protected readonly team = signal<TeamTimesheet | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly dates = computed(() =>
    Array.from({ length: 7 }, (_, index) => addDays(this.weekStart(), index)),
  );
  protected readonly holidays = computed(
    () => new Map((this.team()?.publicHolidays ?? []).map((holiday) => [holiday.date, holiday.name])),
  );

  protected readonly formatDuration = formatDuration;
  protected readonly fullName = fullName;
  protected readonly describeAlert = describeAlert;
  protected readonly absenceLabels = ABSENCE_TYPE_LABELS;
  protected readonly absenceShort: Record<AbsenceType, string> = {
    PAID_LEAVE: 'CP',
    RTT: 'RTT',
    SICK_LEAVE: 'Mal.',
    UNPAID_LEAVE: 'SS',
    FAMILY_EVENT: 'Fam.',
    OTHER: 'Abs.',
  };
  protected readonly overtime = overtimeMinutes;
  protected readonly complementary = complementaryMinutes;

  constructor() {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.timezone.set(user.company.timezone);
        this.weekStart.set(this.currentWeekStart());
        this.load();
      },
      error: () => this.load(),
    });
  }

  protected selectWeek(weekStart: string): void {
    this.weekStart.set(weekStart);
    this.load();
  }

  protected dayLabel(date: string): string {
    return `${formatWeekdayShort(date)} ${Number(date.slice(8))}`;
  }

  protected alertTooltip(row: TeamTimesheetRow): string {
    return [...row.days.flatMap((day) => day.alerts), ...(row.weeks[0]?.alerts ?? [])]
      .map((alert) => describeAlert(alert))
      .join('\n');
  }

  protected rowAlertCount(row: TeamTimesheetRow): number {
    return row.totals.alertCount;
  }

  private load(): void {
    const from = this.weekStart();
    this.loading.set(true);
    this.error.set(null);

    this.timeService.getTeamTimesheet(from, addDays(from, 6)).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'Les heures de l’équipe n’ont pas pu être chargées.'));
      },
    });
  }
}
