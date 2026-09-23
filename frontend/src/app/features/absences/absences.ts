import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { CurrentUser, isManagerRole } from '../../core/auth/auth.models';
import { apiErrorMessage } from '../../core/http/error-message';
import {
  ABSENCE_STATUS_LABELS,
  ABSENCE_TYPE_LABELS,
  ABSENCE_TYPES,
  AbsenceStatus,
} from '../../core/time/labels';
import { formatShortDate, fullName, todayKey } from '../../core/time/time-format';
import { CurrentUserService } from '../../core/user/current-user.service';
import { AbsenceRequest, AbsencesService } from './absences.service';

function datesInOrder(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string;
  const end = group.get('endDate')?.value as string;
  return start && end && end < start ? { datesOrder: true } : null;
}

@Component({
  selector: 'app-absences',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './absences.html',
  styleUrl: './absences.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Absences {
  private readonly absencesService = inject(AbsencesService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly user = signal<CurrentUser | null>(null);
  protected readonly isManager = computed(() => {
    const user = this.user();
    return user !== null && isManagerRole(user.role);
  });

  protected readonly mine = signal<AbsenceRequest[]>([]);
  protected readonly team = signal<AbsenceRequest[]>([]);
  protected readonly teamFilter = signal<AbsenceStatus | 'ALL'>('ALL');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly busyId = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly reviewComments = signal<Record<string, string | undefined>>({});

  protected readonly pending = computed(() =>
    this.team().filter((request) => request.status === 'PENDING'),
  );
  protected readonly filteredTeam = computed(() => {
    const filter = this.teamFilter();
    return filter === 'ALL' ? this.team() : this.team().filter((request) => request.status === filter);
  });

  protected readonly form = this.formBuilder.nonNullable.group(
    {
      type: ['PAID_LEAVE' as AbsenceRequest['type'], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startsAfternoon: [false],
      endsMorning: [false],
      comment: ['', Validators.maxLength(500)],
    },
    { validators: datesInOrder },
  );

  protected readonly types = ABSENCE_TYPES;
  protected readonly typeLabels = ABSENCE_TYPE_LABELS;
  protected readonly statusLabels = ABSENCE_STATUS_LABELS;
  protected readonly fullName = fullName;
  protected readonly statusFilters: Array<AbsenceStatus | 'ALL'> = [
    'ALL',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
  ];

  constructor() {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.reload();
      },
      error: () => this.reload(),
    });
  }

  protected reload(): void {
    this.loading.set(true);
    this.error.set(null);

    this.absencesService.listMine().subscribe({
      next: (requests) => {
        this.mine.set(requests);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(response, 'Vos absences n’ont pas pu être chargées.'));
      },
    });

    if (this.isManager()) {
      this.absencesService.listTeam().subscribe({
        next: (requests) => this.team.set(requests),
        error: (response: HttpErrorResponse) => this.error.set(apiErrorMessage(response)),
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);

    this.absencesService
      .create({
        type: value.type,
        startDate: value.startDate,
        endDate: value.endDate,
        startsAfternoon: value.startsAfternoon,
        endsMorning: value.endsMorning,
        comment: value.comment.trim() || undefined,
      })
      .subscribe({
        next: (request) => {
          this.saving.set(false);
          this.form.reset();
          this.snackBar.open(
            `Demande envoyée : ${this.daysLabel(request.days)}. Votre responsable va la traiter.`,
            'OK',
            { duration: 5000 },
          );
          this.reload();
        },
        error: (response: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(apiErrorMessage(response));
        },
      });
  }

  protected cancel(request: AbsenceRequest): void {
    this.runAction(request.id, this.absencesService.cancel(request.id), 'Demande annulée.');
  }

  protected approve(request: AbsenceRequest): void {
    this.runAction(
      request.id,
      this.absencesService.approve(request.id, this.commentFor(request.id)),
      `Absence de ${fullName(request.employee)} acceptée.`,
    );
  }

  protected reject(request: AbsenceRequest): void {
    this.runAction(
      request.id,
      this.absencesService.reject(request.id, this.commentFor(request.id)),
      `Absence de ${fullName(request.employee)} refusée.`,
    );
  }

  protected setComment(id: string, comment: string): void {
    this.reviewComments.update((comments) => ({ ...comments, [id]: comment }));
  }

  protected canCancel(request: AbsenceRequest): boolean {
    const today = todayKey(this.user()?.company.timezone ?? 'Europe/Paris');
    return request.status === 'PENDING' || (request.status === 'APPROVED' && request.startDate > today);
  }

  protected canReview(request: AbsenceRequest): boolean {
    const user = this.user();
    return user !== null && (user.role === 'ADMIN' || request.employee.id !== user.id);
  }

  protected period(request: AbsenceRequest): string {
    const start = `${formatShortDate(request.startDate)}${request.startsAfternoon ? ' (après-midi)' : ''}`;
    const end = `${formatShortDate(request.endDate)}${request.endsMorning ? ' (matin)' : ''}`;
    return request.startDate === request.endDate
      ? `Le ${formatShortDate(request.startDate)}${request.startsAfternoon ? ' après-midi' : request.endsMorning ? ' matin' : ''}`
      : `Du ${start} au ${end}`;
  }

  protected daysLabel(days: number): string {
    return `${String(days).replace('.', ',')} jour${days > 1 ? 's' : ''} ouvré${days > 1 ? 's' : ''}`;
  }

  protected statusClass(status: AbsenceStatus): string {
    return {
      PENDING: 'wh-chip-amber',
      APPROVED: 'wh-chip-lime',
      REJECTED: 'wh-chip-coral',
      CANCELLED: 'wh-chip-muted',
    }[status];
  }

  private commentFor(id: string): string | undefined {
    return this.reviewComments()[id]?.trim() || undefined;
  }

  private runAction(
    id: string,
    request: ReturnType<AbsencesService['cancel']>,
    successMessage: string,
  ): void {
    this.busyId.set(id);
    this.error.set(null);

    request.subscribe({
      next: () => {
        this.busyId.set(null);
        this.snackBar.open(successMessage, 'OK', { duration: 4000 });
        this.reload();
      },
      error: (response: HttpErrorResponse) => {
        this.busyId.set(null);
        this.error.set(apiErrorMessage(response));
      },
    });
  }
}
