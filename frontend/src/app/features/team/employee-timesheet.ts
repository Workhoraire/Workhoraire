import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';

import { CurrentUser } from '../../core/auth/auth.models';
import { apiErrorMessage } from '../../core/http/error-message';
import { ROLE_LABELS, describeAlert } from '../../core/time/labels';
import {
  addDays,
  formatDuration,
  fullName,
  startOfWeek,
  todayKey,
} from '../../core/time/time-format';
import {
  EmployeeTimesheet,
  TimeEntryAuditLog,
  TimesheetDay,
} from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { AuditLogList } from '../../shared/timesheet/audit-log-list';
import { EntryAction, TimesheetDays } from '../../shared/timesheet/timesheet-days';
import { WeekNavigator } from '../../shared/timesheet/week-navigator';
import { WeekSummary } from '../../shared/timesheet/week-summary';
import { EntryDialog, EntryDialogData, EntryDialogResult } from './entry-dialog';

@Component({
  selector: 'app-employee-timesheet',
  imports: [
    AuditLogList,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    TimesheetDays,
    WeekNavigator,
    WeekSummary,
  ],
  template: `
    <section class="wh-page">
      <a mat-button routerLink="/team" class="back">
        <mat-icon aria-hidden="true">arrow_back</mat-icon>
        Heures de l’équipe
      </a>

      <header class="wh-page-header">
        <div>
          <p class="wh-eyebrow">Feuille de temps</p>
          <h1>{{ timesheet() ? fullName(timesheet()!.employee) : 'Salarié' }}</h1>
          @if (timesheet(); as sheet) {
            <p>
              {{ roleLabel(sheet.employee.role) }} · contrat de
              {{ formatDuration(sheet.employee.weeklyContractMinutes) }} par semaine
              @if (!sheet.employee.isActive) {
                · compte désactivé
              }
            </p>
          }
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

      @if (isOwnSheetForManager()) {
        <div class="wh-message wh-message-info">
          <mat-icon aria-hidden="true">info</mat-icon>
          <span>Vos propres heures ne peuvent être corrigées que par un administrateur.</span>
        </div>
      }

      @if (loading() && !timesheet()) {
        <div class="wh-loading" role="status">
          <mat-spinner diameter="32" />
          <span>Chargement…</span>
        </div>
      } @else if (timesheet(); as sheet) {
        <app-week-summary [week]="sheet.weeks[0]" />

        @for (alert of sheet.weeks[0]?.alerts ?? []; track alert.code) {
          <div class="wh-message wh-message-warning">
            <mat-icon aria-hidden="true">warning_amber</mat-icon>
            <span>{{ describeAlert(alert) }}</span>
          </div>
        }

        <app-timesheet-days
          [days]="sheet.days"
          [timezone]="sheet.timezone"
          [today]="today()"
          [editable]="canEdit()"
          (addEntry)="openCreate($event)"
          (editEntry)="openEdit($event)"
          (deleteEntry)="openDelete($event)"
        />

        <section class="wh-card corrections" aria-labelledby="corrections-title">
          <h2 id="corrections-title">Historique des corrections</h2>
          <app-audit-log-list [logs]="auditLogs()" [timezone]="sheet.timezone" />
        </section>
      }
    </section>
  `,
  styles: `
    .back {
      margin: 0 0 0.5rem -0.75rem;
    }
    .corrections {
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTimesheetPage {
  /** Route parameter, bound by the router. */
  readonly employeeId = input.required<string>();

  private readonly timeService = inject(TimeService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly currentUser = signal<CurrentUser | null>(null);
  private readonly timezone = computed(() => this.currentUser()?.company.timezone ?? 'Europe/Paris');
  protected readonly today = computed(() => todayKey(this.timezone()));
  protected readonly currentWeekStart = computed(() => startOfWeek(this.today()));
  protected readonly weekStart = signal(startOfWeek(todayKey('Europe/Paris')));

  protected readonly timesheet = signal<EmployeeTimesheet | null>(null);
  protected readonly auditLogs = signal<TimeEntryAuditLog[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Only the last requested week may be displayed, even if an older response arrives later. */
  private loadSubscription?: Subscription;

  protected readonly isOwnSheetForManager = computed(() => {
    const user = this.currentUser();
    return user?.role === 'MANAGER' && user.id === this.employeeId();
  });
  protected readonly canEdit = computed(() => this.currentUser() !== null && !this.isOwnSheetForManager());

  protected readonly formatDuration = formatDuration;
  protected readonly fullName = fullName;
  protected readonly describeAlert = describeAlert;

  constructor() {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.weekStart.set(this.currentWeekStart());
      },
    });

    // Route inputs are only available after construction: load reactively, and
    // reload when the employee (route parameter) or the selected week changes.
    effect(() => {
      const employeeId = this.employeeId();
      const weekStart = this.weekStart();
      if (this.currentUser()) {
        untracked(() => this.load(employeeId, weekStart));
      }
    });
  }

  protected roleLabel(role: string): string {
    return ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role;
  }

  protected selectWeek(weekStart: string): void {
    this.weekStart.set(weekStart);
  }

  protected openCreate(day: TimesheetDay): void {
    this.openDialog({ mode: 'create', date: day.date }, (result) =>
      this.timeService.createEntry({
        userId: this.employeeId(),
        startAt: result.startAt!,
        endAt: result.endAt!,
        note: result.note || undefined,
        reason: result.reason,
      }),
    );
  }

  protected openEdit({ day, entry }: EntryAction): void {
    this.openDialog({ mode: 'edit', date: day.date, entry }, (result) =>
      this.timeService.updateEntry(entry.id, {
        startAt: result.startAt,
        endAt: result.endAt,
        note: result.note,
        reason: result.reason,
      }),
    );
  }

  protected openDelete({ day, entry }: EntryAction): void {
    this.openDialog({ mode: 'delete', date: day.date, entry }, (result) =>
      this.timeService.deleteEntry(entry.id, result.reason),
    );
  }

  private openDialog(
    data: Pick<EntryDialogData, 'mode' | 'date' | 'entry'>,
    save: (result: EntryDialogResult) => Observable<unknown>,
  ): void {
    const sheet = this.timesheet();
    if (!sheet) {
      return;
    }

    this.dialog
      .open<EntryDialog, EntryDialogData, EntryDialogResult>(EntryDialog, {
        data: { ...data, employeeName: fullName(sheet.employee), timezone: sheet.timezone },
        width: '28rem',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        save(result).subscribe({
          next: () => {
            this.snackBar.open('Correction enregistrée et tracée.', 'OK', { duration: 4000 });
            this.load(this.employeeId(), this.weekStart());
          },
          error: (response: HttpErrorResponse) => this.error.set(apiErrorMessage(response)),
        });
      });
  }

  private load(employeeId: string, from: string): void {
    const to = addDays(from, 6);
    this.loading.set(true);
    this.error.set(null);
    this.loadSubscription?.unsubscribe();

    this.loadSubscription = forkJoin({
      timesheet: this.timeService.getEmployeeTimesheet(employeeId, from, to),
      auditLogs: this.timeService.getAuditLogs(from, to, employeeId),
    }).subscribe({
      next: ({ timesheet, auditLogs }) => {
        this.timesheet.set(timesheet);
        this.auditLogs.set(auditLogs);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'La feuille de temps n’a pas pu être chargée.'));
      },
    });
  }
}
