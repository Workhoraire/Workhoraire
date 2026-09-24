import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { DownloadService } from '../../core/http/download.service';
import { apiErrorMessage } from '../../core/http/error-message';
import { addDays, formatShortDate, todayKey } from '../../core/time/time-format';
import { CurrentUserService } from '../../core/user/current-user.service';

type Granularity = 'week' | 'day';

/** Last day of the month of a "YYYY-MM" value. */
function endOfMonth(month: string): string {
  const [year, monthIndex] = month.split('-').map(Number);
  return addDays(`${month}-01`, new Date(Date.UTC(year, monthIndex, 0)).getUTCDate() - 1);
}

const monthLabel = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * The current month and the previous ones, newest first, as a list: the native
 * month picker is a plain text box in Safari and Firefox on computers.
 */
export function recentMonths(today: string, count: number): { value: string; label: string }[] {
  const [year, month] = today.split('-').map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - index, 1));
    const value = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    return { value, label: monthLabel.format(date) };
  });
}

@Component({
  selector: 'app-exports',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './exports.html',
  styleUrl: './exports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exports {
  private readonly downloads = inject(DownloadService);
  private readonly formBuilder = inject(FormBuilder);

  private readonly timezone = signal('Europe/Paris');
  /** Two years of months: exports cover at most 62 days, older months are rarely asked. */
  protected readonly months = computed(() => recentMonths(todayKey(this.timezone()), 24));
  protected readonly mode = signal<'month' | 'range'>('month');
  protected readonly downloading = signal<Granularity | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    month: [this.previousMonth(todayKey('Europe/Paris')), Validators.required],
    from: [''],
    to: [''],
  });
  private readonly values = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  protected readonly period = computed(() => {
    const { month, from, to } = this.values();
    if (this.mode() === 'month') {
      return month ? { from: `${month}-01`, to: endOfMonth(month) } : null;
    }
    return from && to && from <= to ? { from, to } : null;
  });

  protected readonly periodLabel = computed(() => {
    const period = this.period();
    return period ? `du ${formatShortDate(period.from)} au ${formatShortDate(period.to)}` : '';
  });

  constructor() {
    inject(CurrentUserService)
      .getCurrentUser()
      .subscribe({
        next: (user) => this.timezone.set(user.company.timezone),
      });
  }

  protected download(granularity: Granularity): void {
    if (this.downloading()) {
      return;
    }
    const period = this.period();
    if (!period) {
      this.error.set('Choisissez une période valide.');
      return;
    }

    this.downloading.set(granularity);
    this.error.set(null);

    const fileName = `workhoraire-${granularity === 'week' ? 'semaines' : 'jours'}-${period.from}_${period.to}.csv`;
    this.downloads
      .download('/exports/timesheets', fileName, { from: period.from, to: period.to, granularity })
      .subscribe({
        next: () => this.downloading.set(null),
        error: (response: HttpErrorResponse) => {
          this.downloading.set(null);
          this.error.set(
            apiErrorMessage(
              response,
              'L’export n’a pas pu être généré (période de 62\u00a0jours au plus).',
            ),
          );
        },
      });
  }

  private previousMonth(today: string): string {
    const [year, month] = today.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 2, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }
}
