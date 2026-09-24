import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { formatDayLabel, toTimeValue } from '../../core/time/time-format';
import { TimesheetEntry } from '../../core/time/time.models';
import { entryChanges, formInstants } from './entry-changes';

export interface EntryDialogData {
  mode: 'create' | 'edit' | 'delete';
  employeeName: string;
  date: string;
  timezone: string;
  entry?: TimesheetEntry;
}

export interface EntryDialogResult {
  startAt?: string;
  endAt?: string;
  note?: string;
  reason: string;
}

@Component({
  selector: 'app-entry-dialog',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
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
            </mat-form-field>
            <mat-form-field>
              <mat-label>Fin</mat-label>
              <input matInput type="time" formControlName="end" [required]="endRequired" />
              @if (endsNextDay()) {
                <mat-hint>Se termine le lendemain</mat-hint>
              }
              @if (form.controls.end.touched && form.controls.end.invalid) {
                <mat-error>Indiquez l’heure de fin.</mat-error>
              }
            </mat-form-field>
          </div>
          <mat-form-field>
            <mat-label>Note visible par le salarié (facultative)</mat-label>
            <input matInput formControlName="note" maxlength="500" />
          </mat-form-field>
          @if (nothingChanged()) {
            <div class="wh-message wh-message-warning" role="alert">
              <span>Aucune modification : changez une heure ou la note.</span>
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
          <mat-hint>Obligatoire : il sera visible par le salarié.</mat-hint>
          @if (form.controls.reason.touched && form.controls.reason.invalid) {
            <mat-error>Indiquez le motif.</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Annuler</button>
        <button mat-flat-button type="submit">{{ data.mode === 'delete' ? 'Supprimer' : 'Enregistrer' }}</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .context {
      margin-bottom: 1rem;
      color: var(--wh-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDialog {
  protected readonly data = inject<EntryDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EntryDialog, EntryDialogResult>);
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

  protected readonly form = this.formBuilder.nonNullable.group({
    start: [this.data.entry ? toTimeValue(this.data.entry.startAt, this.data.timezone) : '', this.data.mode === 'delete' ? [] : [Validators.required]],
    end: [
      this.data.entry?.endAt ? toTimeValue(this.data.entry.endAt, this.data.timezone) : '',
      this.data.mode !== 'delete' && this.endRequired ? [Validators.required] : [],
    ],
    note: [this.data.entry?.note ?? ''],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
  });

  private readonly values = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly endsNextDay = computed(() => {
    const { start, end } = this.values();
    return Boolean(start && end && end <= start);
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.nothingChanged.set(false));
  }

  protected submit(): void {
    if (!this.form.controls.reason.value.trim()) {
      this.form.controls.reason.setValue('');
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { start, end, note, reason } = this.form.getRawValue();
    if (this.data.mode === 'delete') {
      this.dialogRef.close({ reason: reason.trim() });
      return;
    }

    if (this.data.mode === 'edit' && this.data.entry) {
      const changes = entryChanges(this.data.date, this.data.entry, { start, end, note }, this.data.timezone);
      if (Object.keys(changes).length === 0) {
        this.nothingChanged.set(true);
        return;
      }
      this.dialogRef.close({ ...changes, reason: reason.trim() });
      return;
    }

    this.dialogRef.close({
      ...formInstants(this.data.date, { start, end }, this.data.timezone),
      note: note.trim(),
      reason: reason.trim(),
    });
  }
}
