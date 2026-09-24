import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface RevokeDialogData {
  employeeName: string;
  period: string;
}

/** Asks for the reason before a manager cancels an approved absence. */
@Component({
  selector: 'app-revoke-dialog',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Annuler l’absence</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <mat-dialog-content class="wh-form">
        <p class="context">{{ data.employeeName }} · {{ data.period }}</p>
        <p>
          Ces jours ne seront plus comptés comme absence. Le salarié verra la décision, avec votre
          nom et le motif.
        </p>
        <mat-form-field>
          <mat-label>Motif de l’annulation</mat-label>
          <input matInput formControlName="comment" maxlength="500" required />
          @if (form.controls.comment.touched && form.controls.comment.invalid) {
            <mat-error>Indiquez le motif.</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Retour</button>
        <button mat-flat-button type="submit">Annuler l’absence</button>
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
export class RevokeDialog {
  protected readonly data = inject<RevokeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RevokeDialog, string>);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected submit(): void {
    const comment = this.form.controls.comment.value.trim();
    if (!comment || this.form.invalid) {
      this.form.controls.comment.setValue(comment);
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(comment);
  }
}
