import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, forkJoin } from 'rxjs';

import { DownloadService } from '../../core/http/download.service';
import { apiErrorMessage } from '../../core/http/error-message';
import { describeAlert } from '../../core/time/labels';
import { addDays, startOfWeek, todayKey } from '../../core/time/time-format';
import { EmployeeTimesheet, TimeEntryAuditLog } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { AuditLogList } from '../../shared/timesheet/audit-log-list';
import { TimesheetDays } from '../../shared/timesheet/timesheet-days';
import { WeekNavigator } from '../../shared/timesheet/week-navigator';
import { WeekSummary } from '../../shared/timesheet/week-summary';

@Component({
  selector: 'app-my-time',
  imports: [
    AuditLogList,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TimesheetDays,
    WeekNavigator,
    WeekSummary,
  ],
  template: `
    <section class="wh-page">
      <header class="wh-page-header">
        <div>
          <p class="wh-eyebrow">Mon espace</p>
          <h1>Mes heures</h1>
          <p>
            Le détail de vos pointages, semaine par semaine. Ces relevés vous appartiennent : en cas
            d’erreur, signalez-la à votre responsable, qui pourra la corriger avec un motif visible
            ci-dessous.
          </p>
        </div>
        <app-week-navigator
          [weekStart]="weekStart()"
          [currentWeekStart]="currentWeekStart()"
          (weekChange)="selectWeek($event)"
        />
      </header>

      @if (error(); as message) {
        <div class="wh-message wh-message-error" role="alert">
          <mat-icon aria-hidden="true">error_outline</mat-icon>
          <span>{{ message }}</span>
        </div>
      }

      @if (loading()) {
        <div class="wh-loading" role="status">
          <mat-spinner diameter="32" aria-hidden="true" />
          <span>Chargement de la semaine…</span>
        </div>
      } @else if (timesheet(); as sheet) {
        <app-week-summary [week]="sheet.weeks[0]" />

        @for (alert of sheet.weeks[0]?.alerts ?? []; track alert.code) {
          <div class="wh-message wh-message-warning">
            <mat-icon aria-hidden="true">warning_amber</mat-icon>
            <span>{{ describeAlert(alert) }}</span>
          </div>
        }

        <app-timesheet-days [days]="sheet.days" [timezone]="sheet.timezone" [today]="today()" />

        <section class="wh-card corrections" aria-labelledby="corrections-title">
          <h2 id="corrections-title">Corrections de mes pointages</h2>
          <app-audit-log-list [logs]="auditLogs()" [timezone]="sheet.timezone" />
        </section>
      }

      <section class="wh-card personal-data" aria-labelledby="personal-data-title">
        <h2 id="personal-data-title">Mes données personnelles</h2>
        <p>
          Téléchargez tout ce que WorkHoraire enregistre sur vous : profil, contrats, pointages,
          absences et corrections, dans un fichier JSON.
        </p>
        <button
          mat-stroked-button
          type="button"
          [disabled]="downloading()"
          (click)="downloadMyData()"
        >
          <mat-icon aria-hidden="true">download</mat-icon>
          Télécharger mes données
        </button>
      </section>
    </section>
  `,
  styles: `
    .corrections,
    .personal-data {
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTime {
  private readonly downloads = inject(DownloadService);
  private readonly timeService = inject(TimeService);
  private readonly currentUserService = inject(CurrentUserService);

  private readonly timezone = signal('Europe/Paris');
  protected readonly today = computed(() => todayKey(this.timezone()));
  protected readonly currentWeekStart = computed(() => startOfWeek(this.today()));
  protected readonly weekStart = signal(startOfWeek(todayKey('Europe/Paris')));

  protected readonly timesheet = signal<EmployeeTimesheet | null>(null);
  protected readonly auditLogs = signal<TimeEntryAuditLog[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly downloading = signal(false);
  /** Only the last requested week may be displayed, even if an older response arrives later. */
  private loadSubscription?: Subscription;

  protected readonly describeAlert = describeAlert;

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

  /** Rights of access and portability (GDPR): everything stored about me, as a file. */
  protected downloadMyData(): void {
    if (this.downloading()) {
      return;
    }
    this.downloading.set(true);
    this.error.set(null);
    this.downloads
      .download('/me/data-export', `workhoraire-mes-donnees-${this.today()}.json`)
      .subscribe({
        next: () => this.downloading.set(false),
        error: (response: HttpErrorResponse) => {
          this.downloading.set(false);
          this.error.set(apiErrorMessage(response, 'Vos données n’ont pas pu être téléchargées.'));
        },
      });
  }

  protected selectWeek(weekStart: string): void {
    this.weekStart.set(weekStart);
    this.load();
  }

  private load(): void {
    const from = this.weekStart();
    const to = addDays(from, 6);
    this.loading.set(true);
    this.error.set(null);
    this.loadSubscription?.unsubscribe();

    this.loadSubscription = forkJoin({
      timesheet: this.timeService.getMyTimesheet(from, to),
      auditLogs: this.timeService.getMyAuditLogs(from, to),
    }).subscribe({
      next: ({ timesheet, auditLogs }) => {
        this.timesheet.set(timesheet);
        this.auditLogs.set(auditLogs);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        // Never leave another week's hours under the new dates.
        this.timesheet.set(null);
        this.auditLogs.set([]);
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'Vos heures n’ont pas pu être chargées.'));
      },
    });
  }
}
