import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

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
  TimesheetEmployee,
} from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { AuditLogList } from '../../shared/timesheet/audit-log-list';
import { EntryAction, TimesheetDays } from '../../shared/timesheet/timesheet-days';
import { WeekNavigator } from '../../shared/timesheet/week-navigator';
import { WeekSummary } from '../../shared/timesheet/week-summary';
import { EntryDialog, EntryDialogData } from './entry-dialog';
import { weekFromParam, weekQueryParams } from './week-param';

const SAVED_MESSAGES: Record<EntryDialogData['mode'], string> = {
  create: 'Période ajoutée et tracée.',
  edit: 'Correction enregistrée et tracée.',
  delete: 'Période supprimée et tracée.',
};

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
      <a mat-button routerLink="/team" [queryParams]="weekQuery()" class="back">
        <mat-icon aria-hidden="true">arrow_back</mat-icon>
        Heures de l’équipe
      </a>

      <header class="wh-page-header">
        <div>
          <p class="wh-eyebrow">Feuille de temps</p>
          <h1>{{ employeeName() }}</h1>
          @if (employee(); as person) {
            <p>
              {{ roleLabel(person.role) }} · contrat de
              {{ formatDuration(person.weeklyContractMinutes) }} par semaine
              @if (!person.isActive) {
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
        <div class="wh-message wh-message-error load-error">
          <mat-icon aria-hidden="true">error_outline</mat-icon>
          <span role="alert">{{ message }}</span>
          <button mat-button type="button" (click)="retry()">Réessayer</button>
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
    .load-error {
      flex-wrap: wrap;
      align-items: center;
    }
    .load-error button {
      margin-left: auto;
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly injector = inject(Injector);
  private readonly days = viewChild(TimesheetDays);

  protected readonly currentUser = signal<CurrentUser | null>(null);
  private readonly timezone = computed(
    () => this.currentUser()?.company.timezone ?? 'Europe/Paris',
  );
  protected readonly today = computed(() => todayKey(this.timezone()));
  protected readonly currentWeekStart = computed(() => startOfWeek(this.today()));
  protected readonly weekStart = signal(startOfWeek(todayKey('Europe/Paris')));
  /** The selected week goes back to the team page with the "Heures de l’équipe" link. */
  protected readonly weekQuery = computed(() =>
    weekQueryParams(this.weekStart(), this.currentWeekStart()),
  );

  /** Kept while another week loads: the header does not blink. */
  protected readonly employee = signal<TimesheetEmployee | null>(null);
  protected readonly employeeName = computed(() => {
    const employee = this.employee();
    return employee ? fullName(employee) : 'Salarié';
  });
  protected readonly timesheet = signal<EmployeeTimesheet | null>(null);
  protected readonly auditLogs = signal<TimeEntryAuditLog[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Only the last requested week may be displayed, even if an older response arrives later. */
  private loadSubscription?: Subscription;
  /** Employee and week of the displayed timesheet, e.g. "id|2026-09-21". */
  private shownWeek: string | null = null;

  protected readonly isOwnSheetForManager = computed(() => {
    const user = this.currentUser();
    return user?.role === 'MANAGER' && user.id === this.employeeId();
  });
  protected readonly canEdit = computed(
    () => this.currentUser() !== null && !this.isOwnSheetForManager(),
  );

  protected readonly formatDuration = formatDuration;
  protected readonly describeAlert = describeAlert;

  constructor() {
    const requestedWeek = this.route.snapshot.queryParamMap.get('semaine');
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.weekStart.set(weekFromParam(requestedWeek, this.currentWeekStart()));
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
    this.rememberWeek();
  }

  protected retry(): void {
    this.load(this.employeeId(), this.weekStart());
  }

  protected openCreate(day: TimesheetDay): void {
    this.openDialog({ mode: 'create', date: day.date });
  }

  protected openEdit({ day, entry }: EntryAction): void {
    this.openDialog({ mode: 'edit', date: day.date, entry });
  }

  protected openDelete({ day, entry }: EntryAction): void {
    this.openDialog({ mode: 'delete', date: day.date, entry });
  }

  /** The dialog saves by itself and closes with `true` once the change is recorded. */
  private openDialog(data: Pick<EntryDialogData, 'mode' | 'date' | 'entry'>): void {
    const sheet = this.timesheet();
    if (!sheet) {
      return;
    }

    this.dialog
      .open<EntryDialog, EntryDialogData, boolean>(EntryDialog, {
        data: {
          ...data,
          employeeId: this.employeeId(),
          employeeName: fullName(sheet.employee),
          timezone: sheet.timezone,
        },
        width: '28rem',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((saved) => {
        if (!saved) {
          return;
        }
        this.snackBar.open(SAVED_MESSAGES[data.mode], 'OK', { duration: 4000 });
        // A deleted period takes its buttons away: the focus moves to its day.
        this.load(this.employeeId(), this.weekStart(), data.mode === 'delete' ? data.date : null);
      });
  }

  private load(employeeId: string, from: string, focusDate: string | null = null): void {
    const to = addDays(from, 6);
    const week = `${employeeId}|${from}`;
    // Another week or another employee: the hours on screen must never appear
    // under the new dates, even for a moment. The same week stays while it refreshes.
    if (this.shownWeek !== week) {
      this.timesheet.set(null);
      this.auditLogs.set([]);
      this.shownWeek = null;
    }
    if (this.employee()?.id !== employeeId) {
      this.employee.set(null);
    }
    this.loading.set(true);
    this.error.set(null);
    this.loadSubscription?.unsubscribe();

    this.loadSubscription = forkJoin({
      timesheet: this.timeService.getEmployeeTimesheet(employeeId, from, to),
      auditLogs: this.timeService.getAuditLogs(from, to, employeeId),
    }).subscribe({
      next: ({ timesheet, auditLogs }) => {
        this.timesheet.set(timesheet);
        this.employee.set(timesheet.employee);
        this.auditLogs.set(auditLogs);
        this.shownWeek = week;
        this.loading.set(false);
        if (focusDate) {
          afterNextRender(() => this.days()?.focusDay(focusDate), { injector: this.injector });
        }
      },
      error: (response: HttpErrorResponse) => {
        this.timesheet.set(null);
        this.auditLogs.set([]);
        this.shownWeek = null;
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'La feuille de temps n’a pas pu être chargée.'));
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
