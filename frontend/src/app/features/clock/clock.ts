import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { CurrentUser } from '../../core/auth/auth.models';
import { apiErrorMessage } from '../../core/http/error-message';
import { ABSENCE_TYPE_LABELS, describeAlert } from '../../core/time/labels';
import {
  formatDayLabel,
  formatDuration,
  formatLongDate,
  formatTime,
  formatWeekdayShort,
  localDateTimeToIso,
  toDateKey,
} from '../../core/time/time-format';
import {
  ClockStatus,
  TimesheetEntry,
  complementaryMinutes,
  overtimeMinutes,
} from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';

/** Same rule as the backend: an entry open for longer was probably forgotten. */
const FORGOTTEN_AFTER_MS = 12 * 60 * 60 * 1000;

interface WeekBar {
  date: string;
  label: string;
  minutes: number;
  percent: number;
  isToday: boolean;
  isAbsent: boolean;
}

@Component({
  selector: 'app-clock',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clock {
  private readonly timeService = inject(TimeService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly user = signal<CurrentUser | null>(null);
  protected readonly status = signal<ClockStatus | null>(null);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showNote = signal(false);
  /** Difference between the server clock and this device, in milliseconds. */
  private readonly clockOffset = signal(0);
  private readonly now = signal(Date.now());

  protected readonly noteControl = this.formBuilder.nonNullable.control('', [Validators.maxLength(500)]);
  protected readonly forgottenForm = this.formBuilder.nonNullable.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    reason: ['Oubli de pointage de sortie', [Validators.required, Validators.maxLength(500)]],
  });

  protected readonly timezone = computed(
    () => this.status()?.timezone ?? this.user()?.company.timezone ?? 'Europe/Paris',
  );
  private readonly serverNow = computed(() => this.now() + this.clockOffset());
  protected readonly todayKey = computed(() => toDateKey(new Date(this.serverNow()), this.timezone()));

  protected readonly openEntry = computed(() => this.status()?.openEntry ?? null);
  protected readonly isForgotten = computed(() => {
    const entry = this.openEntry();
    return entry !== null && this.serverNow() - new Date(entry.startAt).getTime() > FORGOTTEN_AFTER_MS;
  });
  protected readonly isWorking = computed(() => this.openEntry() !== null && !this.isForgotten());

  /** Minutes elapsed since the status was computed by the server. */
  private readonly elapsedMinutes = computed(() => {
    const status = this.status();
    if (!status || !this.isWorking()) {
      return 0;
    }
    return Math.max(
      0,
      Math.floor(this.serverNow() / 60_000) - Math.floor(new Date(status.serverTime).getTime() / 60_000),
    );
  });

  /** Local day on which the running entry started: its minutes are counted on that day. */
  private readonly openEntryDay = computed(() => {
    const entry = this.openEntry();
    return entry ? toDateKey(entry.startAt, this.timezone()) : null;
  });
  protected readonly openEntryDayLabel = computed(() => {
    const day = this.openEntryDay();
    return day ? formatDayLabel(day) : '';
  });

  protected readonly todayMinutes = computed(() => {
    const today = this.status()?.today;
    return today ? this.liveDayMinutes(today.date, today.workedMinutes) : 0;
  });
  /** The running minutes always fall in the current civil week. */
  protected readonly weekMinutes = computed(
    () => (this.status()?.week.workedMinutes ?? 0) + this.elapsedMinutes(),
  );

  /** Running session as "HH:MM:SS". */
  protected readonly sessionClock = computed(() => {
    const entry = this.openEntry();
    if (!entry || !this.isWorking()) {
      return null;
    }
    const seconds = Math.max(0, Math.floor((this.serverNow() - new Date(entry.startAt).getTime()) / 1000));
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  });

  protected readonly statusLine = computed(() => {
    const status = this.status();
    const entry = this.openEntry();
    if (!status) {
      return '';
    }
    if (entry && this.isForgotten()) {
      return 'Un pointage de sortie semble avoir été oublié.';
    }
    if (entry) {
      const startDay = toDateKey(entry.startAt, this.timezone());
      const prefix = startDay === this.todayKey() ? '' : `${formatDayLabel(startDay)} `;
      return `En poste depuis ${prefix}${formatTime(entry.startAt, this.timezone())}`;
    }
    const lastEnd = status.today.lastEndAt;
    if (lastEnd) {
      return `Sortie pointée à ${formatTime(lastEnd, this.timezone())}`;
    }
    return 'Vous n’avez pas encore pointé aujourd’hui.';
  });

  protected readonly clockLabel = computed(() => {
    if (this.isWorking()) {
      return 'Pointer ma sortie';
    }
    return (this.status()?.today.entries.length ?? 0) > 0 ? 'Reprendre le travail' : 'Pointer mon arrivée';
  });

  protected readonly weekBars = computed<WeekBar[]>(() => {
    const status = this.status();
    if (!status) {
      return [];
    }
    const today = this.todayKey();
    const minutes = status.weekDays.map((day) =>
      day.date === status.today.date
        ? this.todayMinutes()
        : this.liveDayMinutes(day.date, day.workedMinutes),
    );
    const max = Math.max(8 * 60, ...minutes);

    return status.weekDays.map((day, index) => ({
      date: day.date,
      label: formatWeekdayShort(day.date).replace('.', ''),
      minutes: minutes[index],
      percent: Math.round((minutes[index] / max) * 100),
      isToday: day.date === today,
      isAbsent: day.absences.length > 0 || day.publicHoliday !== null,
    }));
  });

  protected readonly weekExtraLabel = computed(() => {
    const status = this.status();
    if (!status) {
      return null;
    }
    const overtime = overtimeMinutes(status.week);
    const complementary = complementaryMinutes(status.week);
    if (overtime > 0) {
      return `dont ${formatDuration(overtime)} d’heures supplémentaires`;
    }
    if (complementary > 0) {
      return `dont ${formatDuration(complementary)} d’heures complémentaires`;
    }
    return null;
  });

  protected readonly formatDuration = formatDuration;
  protected readonly formatTime = formatTime;
  protected readonly formatLongDate = formatLongDate;
  protected readonly formatDayLabel = formatDayLabel;
  protected readonly describeAlert = describeAlert;
  protected readonly absenceLabels = ABSENCE_TYPE_LABELS;

  /** Minutes of a day, plus the running minutes if the open entry started that day. */
  private liveDayMinutes(date: string, workedMinutes: number): number {
    return workedMinutes + (date === this.openEntryDay() ? this.elapsedMinutes() : 0);
  }

  /** Duration of an entry, including the minutes elapsed since the last refresh if it is running. */
  protected liveDuration(entry: TimesheetEntry): number {
    return entry.isOpen ? entry.durationMinutes + this.elapsedMinutes() : entry.durationMinutes;
  }

  constructor() {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => this.user.set(user),
    });

    const timer = window.setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => window.clearInterval(timer));

    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.timeService.getClockStatus().subscribe({
      next: (status) => this.applyStatus(status),
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'Votre journée n’a pas pu être chargée.'));
      },
    });
  }

  protected toggleClock(): void {
    const note = this.noteControl.value.trim() || undefined;
    const working = this.isWorking();
    const request = working ? this.timeService.clockOut(note) : this.timeService.clockIn(note);

    this.busy.set(true);
    this.error.set(null);

    request.subscribe({
      next: (entry) => {
        this.busy.set(false);
        this.noteControl.reset('');
        this.showNote.set(false);
        const time = formatTime(working ? entry.endAt : entry.startAt, this.timezone());
        this.snackBar.open(working ? `Sortie pointée à ${time}` : `Arrivée pointée à ${time}`, 'OK', {
          duration: 4000,
        });
        this.load();
      },
      error: (response: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(apiErrorMessage(response));
        // The state may have changed from another device: refresh it.
        this.load();
      },
    });
  }

  protected closeForgottenEntry(): void {
    const entry = this.openEntry();
    if (!entry || this.forgottenForm.invalid) {
      this.forgottenForm.markAllAsTouched();
      return;
    }

    const { date, time, reason } = this.forgottenForm.getRawValue();
    this.busy.set(true);
    this.error.set(null);

    this.timeService
      .closeOpenEntry(localDateTimeToIso(date, time, this.timezone()), reason.trim())
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.snackBar.open('Votre heure de sortie a été enregistrée.', 'OK', { duration: 4000 });
          this.load();
        },
        error: (response: HttpErrorResponse) => {
          this.busy.set(false);
          this.error.set(apiErrorMessage(response));
        },
      });
  }

  private applyStatus(status: ClockStatus): void {
    this.clockOffset.set(new Date(status.serverTime).getTime() - Date.now());
    this.now.set(Date.now());
    this.status.set(status);
    this.loading.set(false);

    if (status.openEntry) {
      this.forgottenForm.patchValue({ date: toDateKey(status.openEntry.startAt, status.timezone), time: '' });
    }
  }
}
