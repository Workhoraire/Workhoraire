import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { environment } from '../../../environments/environment';
import { apiErrorMessage } from '../../core/http/error-message';
import { addDays, formatShortDate, todayKey } from '../../core/time/time-format';
import { CurrentUserService } from '../../core/user/current-user.service';

type Granularity = 'week' | 'day';

/** Last day of the month of a "YYYY-MM" value. */
function endOfMonth(month: string): string {
  const [year, monthIndex] = month.split('-').map(Number);
  return addDays(`${month}-01`, new Date(Date.UTC(year, monthIndex, 0)).getUTCDate() - 1);
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
    ReactiveFormsModule,
  ],
  templateUrl: './exports.html',
  styleUrl: './exports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exports {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);

  private readonly timezone = signal('Europe/Paris');
  protected readonly mode = signal<'month' | 'range'>('month');
  protected readonly downloading = signal<Granularity | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    month: [this.previousMonth(todayKey('Europe/Paris')), Validators.required],
    from: [''],
    to: [''],
  });
  private readonly values = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

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
    const period = this.period();
    if (!period) {
      this.error.set('Choisissez une période valide.');
      return;
    }

    this.downloading.set(granularity);
    this.error.set(null);

    this.http
      .get(`${environment.apiUrl}/exports/timesheets`, {
        params: { from: period.from, to: period.to, granularity },
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          this.downloading.set(null);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `workhoraire-${granularity === 'week' ? 'semaines' : 'jours'}-${period.from}_${period.to}.csv`;
          link.click();
          // Some browsers start the download asynchronously: keep the file available a moment.
          window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
        },
        error: async (response: HttpErrorResponse) => {
          this.downloading.set(null);
          // Errors come back as a Blob because of the response type.
          let parsed = response;
          if (response.error instanceof Blob) {
            try {
              parsed = new HttpErrorResponse({
                error: JSON.parse(await response.error.text()),
                status: response.status,
                statusText: response.statusText,
                url: response.url ?? undefined,
              });
            } catch {
              parsed = response;
            }
          }
          this.error.set(apiErrorMessage(parsed, 'L’export n’a pas pu être généré (période de 62 jours au plus).'));
        },
      });
  }

  private previousMonth(today: string): string {
    const [year, month] = today.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 2, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }
}
