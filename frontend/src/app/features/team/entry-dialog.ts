import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';

import { apiErrorMessage } from '../../core/http/error-message';
import { formatDayLabel, toTimeValue } from '../../core/time/time-format';
import { TimesheetEntry } from '../../core/time/time.models';
import { TimeService } from '../../core/time/time.service';
import { entryChanges, formInstants } from './entry-changes';

export interface EntryDialogData {
  mode: 'create' | 'edit' | 'delete';
  /** Employee whose hours are corrected. */
  employeeId: string;
  employeeName: string;
  date: string;
  timezone: string;
  entry?: TimesheetEntry;
}

/**
 * Adds, corrects or deletes a period, and saves it itself: the dialog only
 * closes (with `true`) once the API has accepted the change. A refusal is
 * shown inside the dialog, so that nothing typed is lost.
 */
@Component({
  selector: 'app-entry-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <mat-dialog-content class="wh-form">
        <p class="context">{{ data.employeeName }} · {{ dayLabel }}</p>

        @if (data.mode !== 'delete') {
          <div class="wh-form-row">
            <mat-form-field>
              <mat-label>Début</mat-label>
              <input matInput type="time" formControlName="start" required />
              @if (form.controls.start.hasError('required')) {
                <mat-error>L’heure de début est obligatoire.</mat-error>
              }
            </mat-form-field>
            <mat-form-field>
              <mat-label>Fin</mat-label>
              <input matInput type="time" formControlName="end" [required]="endRequired" />
              @if (endsNextDay()) {
                <mat-hint>Se termine le lendemain</mat-hint>
              }
              @if (form.controls.end.hasError('required')) {
                <mat-error>L’heure de fin est obligatoire.</mat-error>
              }
            </mat-form-field>
          </div>
          <mat-form-field>
            <mat-label>Note visible par le salarié (facultative)</mat-label>
            <input matInput formControlName="note" maxlength="500" />
          </mat-form-field>
          @if (nothingChanged()) {
            <div class="wh-message wh-message-warning" role="alert">
              <span>Aucune modification&nbsp;: changez une heure ou la note.</span>
            </div>
          }
        } @else {
          <p>
            Cette période sera supprimée des heures du salarié. La suppression reste inscrite dans
            l’historique des corrections, avec votre nom et le motif.
          </p>
        }

        <mat-form-field>
          <mat-label>Motif de la correction</mat-label>
          <input matInput formControlName="reason" maxlength="500" required />
          <mat-hint>Obligatoire&nbsp;: il sera visible par le salarié.</mat-hint>
          @if (form.controls.reason.hasError('required')) {
            <mat-error>Indiquez le motif.</mat-error>
          }
        </mat-form-field>

        @if (error(); as message) {
          <div class="wh-message wh-message-error save-error" role="alert">
            <mat-icon aria-hidden="true">error_outline</mat-icon>
            <span>{{ message }}</span>
          </div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close [disabled]="saving()">Annuler</button>
        <!-- Stays focusable while saving: submit() ignores the extra clicks. -->
        <button mat-flat-button type="submit" disabledInteractive [disabled]="saving()">
          {{ submitLabel() }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .context {
      margin-bottom: 1rem;
      color: var(--wh-muted);
    }
    .save-error {
      margin: 0.5rem 0 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDialog {
  protected readonly data = inject<EntryDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<EntryDialog, boolean>>(MatDialogRef);
  private readonly timeService = inject(TimeService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly title = {
    create: 'Ajouter une période de travail',
    edit: 'Corriger une période',
    delete: 'Supprimer une période',
  }[this.data.mode];
  protected readonly dayLabel = formatDayLabel(this.data.date);
  /** Required to create a period, and to keep a closed period closed. */
  protected readonly endRequired = this.data.mode === 'create' || Boolean(this.data.entry?.endAt);
  protected readonly nothingChanged = signal(false);
  protected readonly saving = signal(false);
  /** Refusal of the API (overlap, read-only mode…), shown until the next attempt. */
  protected readonly error = signal<string | null>(null);
  protected readonly submitLabel = computed(() => {
    if (this.data.mode === 'delete') {
      return this.saving() ? 'Suppression…' : 'Supprimer';
    }
    return this.saving() ? 'Enregistrement…' : 'Enregistrer';
  });

  protected readonly form = this.formBuilder.nonNullable.group({
    start: [
      this.data.entry ? toTimeValue(this.data.entry.startAt, this.data.timezone) : '',
      this.data.mode === 'delete' ? [] : [Validators.required],
    ],
    end: [
      this.data.entry?.endAt ? toTimeValue(this.data.entry.endAt, this.data.timezone) : '',
      this.data.mode !== 'delete' && this.endRequired ? [Validators.required] : [],
    ],
    note: [this.data.entry?.note ?? ''],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
  });

  private readonly values = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  protected readonly endsNextDay = computed(() => {
    const { start, end } = this.values();
    return Boolean(start && end && end <= start);
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.nothingChanged.set(false));
  }

  protected submit(): void {
    // The submit button stays clickable while saving (disabledInteractive): one request at a time.
    if (this.saving()) {
      return;
    }
    if (!this.form.controls.reason.value.trim()) {
      this.form.controls.reason.setValue('');
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.saveRequest();
    if (!request) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    // No closing by Escape or a click outside while the change is being saved.
    this.dialogRef.disableClose = true;
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (response: HttpErrorResponse) => {
        this.saving.set(false);
        this.dialogRef.disableClose = false;
        this.error.set(apiErrorMessage(response));
      },
    });
  }

  /** The API call matching the dialog, or null when there is nothing to send. */
  private saveRequest(): Observable<unknown> | null {
    const { start, end, note, reason } = this.form.getRawValue();
    const motive = reason.trim();
    const entry = this.data.entry;

    if (this.data.mode === 'delete') {
      return entry ? this.timeService.deleteEntry(entry.id, motive) : null;
    }

    if (this.data.mode === 'edit') {
      if (!entry) {
        return null;
      }
      const changes = entryChanges(this.data.date, entry, { start, end, note }, this.data.timezone);
      if (Object.keys(changes).length === 0) {
        this.nothingChanged.set(true);
        return null;
      }
      return this.timeService.updateEntry(entry.id, { ...changes, reason: motive });
    }

    const { startAt, endAt } = formInstants(this.data.date, { start, end }, this.data.timezone);
    if (!endAt) {
      return null;
    }
    return this.timeService.createEntry({
      userId: this.data.employeeId,
      startAt,
      endAt,
      note: note.trim() || undefined,
      reason: motive,
    });
  }
}
