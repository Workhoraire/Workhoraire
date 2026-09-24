import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { apiErrorMessage } from '../../core/http/error-message';
import { ABSENCE_TYPE_LABELS, describeAlert } from '../../core/time/labels';
import {
  addDays,
  formatDayLabel,
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
import { weekFromParam, weekQueryParams } from './week-param';

/** "lun. 21 sept." -> "Lun. 21 sept.", at the start of a line. */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

@Component({
  selector: 'app-team',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink, WeekNavigator],
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team {
  private readonly timeService = inject(TimeService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private readonly timezone = signal('Europe/Paris');
  /** Only administrators can open the "Salariés" page. */
  protected readonly isAdmin = signal(false);
  protected readonly today = computed(() => todayKey(this.timezone()));
  protected readonly currentWeekStart = computed(() => startOfWeek(this.today()));
  protected readonly weekStart = signal(startOfWeek(todayKey('Europe/Paris')));
  /** The selected week goes to an employee's timesheet, and comes back from it. */
  protected readonly weekQuery = computed(() =>
    weekQueryParams(this.weekStart(), this.currentWeekStart()),
  );

  protected readonly team = signal<TeamTimesheet | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Rows whose alerts are shown in full below them. */
  protected readonly expandedRows = signal<ReadonlySet<string>>(new Set());
  /** Only the last requested week may be displayed, even if an older response arrives later. */
  private loadSubscription?: Subscription;

  protected readonly dates = computed(() =>
    Array.from({ length: 7 }, (_, index) => addDays(this.weekStart(), index)),
  );
  protected readonly holidays = computed(
    () =>
      new Map((this.team()?.publicHolidays ?? []).map((holiday) => [holiday.date, holiday.name])),
  );
  /** Employee, the 7 days, total, overtime and alerts. */
  protected readonly columnCount = 11;

  protected readonly formatDuration = formatDuration;
  protected readonly fullName = fullName;
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
    const requestedWeek = this.route.snapshot.queryParamMap.get('semaine');
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.timezone.set(user.company.timezone);
        this.isAdmin.set(user.role === 'ADMIN');
        this.weekStart.set(weekFromParam(requestedWeek, this.currentWeekStart()));
        this.load();
      },
      error: () => {
        this.weekStart.set(weekFromParam(requestedWeek, this.currentWeekStart()));
        this.load();
      },
    });
  }

  protected selectWeek(weekStart: string): void {
    this.weekStart.set(weekStart);
    this.expandedRows.set(new Set());
    this.rememberWeek();
    this.load();
  }

  protected retry(): void {
    this.load();
  }

  protected dayLabel(date: string): string {
    return `${formatWeekdayShort(date)} ${Number(date.slice(8))}`;
  }

  protected rowAlertCount(row: TeamTimesheetRow): number {
    return row.totals.alertCount;
  }

  protected alertCountLabel(row: TeamTimesheetRow): string {
    const count = this.rowAlertCount(row);
    return `${count} alerte${count > 1 ? 's' : ''}`;
  }

  protected isExpanded(row: TeamTimesheetRow): boolean {
    return this.expandedRows().has(row.employee.id);
  }

  /** Shows or hides the alerts of a row: readable on a phone, unlike a tooltip. */
  protected toggleAlerts(row: TeamTimesheetRow): void {
    this.expandedRows.update((rows) => {
      const next = new Set(rows);
      if (next.has(row.employee.id)) {
        next.delete(row.employee.id);
      } else {
        next.add(row.employee.id);
      }
      return next;
    });
  }

  /** "Mar. 22 sept. : Pause de 20 minutes manquante (aucune pause)", then the weekly alerts. */
  protected alertLines(row: TeamTimesheetRow): string[] {
    const daily = row.days.flatMap((day) =>
      day.alerts.map(
        (alert) => `${capitalize(formatDayLabel(day.date))} : ${describeAlert(alert)}`,
      ),
    );
    const weekly = (row.weeks[0]?.alerts ?? []).map((alert) => `Semaine : ${describeAlert(alert)}`);
    return [...daily, ...weekly];
  }

  private load(): void {
    const from = this.weekStart();
    this.loading.set(true);
    this.error.set(null);
    this.loadSubscription?.unsubscribe();

    this.loadSubscription = this.timeService.getTeamTimesheet(from, addDays(from, 6)).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        // Never leave the hours of another week under the dates of this one.
        this.team.set(null);
        this.loading.set(false);
        this.error.set(
          apiErrorMessage(response, 'Les heures de l’équipe n’ont pas pu être chargées.'),
        );
      },
    });
  }

  /** In the address, without a navigation: a reload or the browser's "back" keeps the week. */
  private rememberWeek(): void {
    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: this.weekQuery(),
    });
    this.location.replaceState(url.toString());
  }
}
