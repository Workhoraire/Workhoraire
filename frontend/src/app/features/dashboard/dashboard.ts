import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { apiErrorMessage } from '../../core/http/error-message';
import { ABSENCE_TYPE_LABELS, describeAlert } from '../../core/time/labels';
import {
  formatDayLabel,
  formatDuration,
  formatLongDate,
  formatTime,
  formatWeekRange,
  fullName,
  initials,
  toDateKey,
} from '../../core/time/time-format';
import { DashboardService, TeamDashboard } from './dashboard.service';

const REFRESH_MS = 60_000;

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  protected readonly dashboard = signal<TeamDashboard | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  /** Open entries that are really in progress, and those most likely forgotten. */
  protected readonly present = computed(
    () => this.dashboard()?.presentNow.filter((item) => !item.isOverdue) ?? [],
  );
  protected readonly overdue = computed(
    () => this.dashboard()?.presentNow.filter((item) => item.isOverdue) ?? [],
  );

  protected readonly formatDuration = formatDuration;
  protected readonly formatLongDate = formatLongDate;
  protected readonly formatDayLabel = formatDayLabel;
  protected readonly formatTime = formatTime;
  protected readonly formatWeekRange = formatWeekRange;
  protected readonly fullName = fullName;
  protected readonly initials = initials;
  protected readonly describeAlert = describeAlert;
  protected readonly absenceLabels = ABSENCE_TYPE_LABELS;

  protected sinceDay(since: string, timezone: string): string {
    return formatDayLabel(toDateKey(since, timezone));
  }

  constructor() {
    this.load();
    // Presence changes during the day: refresh quietly every minute.
    const timer = window.setInterval(() => this.load(true), REFRESH_MS);
    inject(DestroyRef).onDestroy(() => window.clearInterval(timer));
  }

  protected load(quiet = false): void {
    if (!quiet) {
      this.loading.set(true);
    }
    this.error.set(null);

    this.dashboardService.getTeamDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard.set(dashboard);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'Le tableau de bord n’a pas pu être chargé.'));
      },
    });
  }
}
