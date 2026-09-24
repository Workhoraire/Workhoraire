import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, Subscription, forkJoin } from 'rxjs';

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
import { confirmAction } from '../../shared/confirm-dialog';
import { AbsenceRequest, AbsencesService } from './absences.service';
import { RevokeDialog, RevokeDialogData } from './revoke-dialog';

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
    MatDialogModule,
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
  private readonly dialog = inject(MatDialog);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly user = signal<CurrentUser | null>(null);
  protected readonly isManager = computed(() => {
    const user = this.user();
    return user !== null && isManagerRole(user.role);
  });

  protected readonly mine = signal<AbsenceRequest[]>([]);
  protected readonly team = signal<AbsenceRequest[]>([]);
  protected readonly teamFilter = signal<AbsenceStatus | 'ALL'>('ALL');
  /** "Mes demandes": loading, then the list or the reason it could not be loaded. */
  protected readonly loading = signal(true);
  protected readonly mineError = signal<string | null>(null);
  /**
   * Requests of the team (managers): never "nothing to validate" while they
   * load or after a failure, which would hide requests waiting for a decision.
   */
  protected readonly teamLoading = signal(true);
  protected readonly teamError = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly busyId = signal<string | null>(null);
  /** Refusal of an action: a new request, a cancellation or a decision. */
  protected readonly error = signal<string | null>(null);
  protected readonly reviewComments = signal<Record<string, string | undefined>>({});

  /** Loaded on its own: the history is capped, a pending request must never be missed. */
  protected readonly pending = signal<AbsenceRequest[]>([]);
  protected readonly filteredTeam = computed(() => {
    const filter = this.teamFilter();
    return filter === 'ALL'
      ? this.team()
      : this.team().filter((request) => request.status === filter);
  });
  /** The count only once it is known. */
  protected readonly pendingTabLabel = computed(() =>
    this.teamLoading() || this.teamError() !== null
      ? 'À valider'
      : `À valider (${this.pending().length})`,
  );

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

  private mineSubscription?: Subscription;
  private teamSubscription?: Subscription;

  constructor() {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loadMine();
        if (isManagerRole(user.role)) {
          this.loadTeam();
        }
      },
      error: () => this.loadMine(),
    });
  }

  /** Quiet after an action: the list stays on screen while it refreshes. */
  protected loadMine(quiet = false): void {
    if (!quiet) {
      this.loading.set(true);
    }
    this.mineError.set(null);
    this.mineSubscription?.unsubscribe();

    this.mineSubscription = this.absencesService.listMine().subscribe({
      next: (requests) => {
        this.mine.set(requests);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.mineError.set(apiErrorMessage(response, 'Vos demandes n’ont pas pu être chargées.'));
      },
    });
  }

  /** Quiet after a decision: the lists stay on screen while they refresh. */
  protected loadTeam(quiet = false): void {
    if (!quiet) {
      this.teamLoading.set(true);
    }
    this.teamError.set(null);
    this.teamSubscription?.unsubscribe();

    this.teamSubscription = forkJoin({
      pending: this.absencesService.listTeam('PENDING'),
      team: this.absencesService.listTeam(),
    }).subscribe({
      next: ({ pending, team }) => {
        // Soonest first: these are the decisions to take.
        this.pending.set([...pending].sort((a, b) => a.startDate.localeCompare(b.startDate)));
        this.team.set(team);
        this.teamLoading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.teamLoading.set(false);
        this.teamError.set(
          apiErrorMessage(response, 'Les demandes de l’équipe n’ont pas pu être chargées.'),
        );
      },
    });
  }

  protected submit(formDirective: FormGroupDirective): void {
    if (this.saving()) {
      return;
    }
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
          // resetForm also clears the "submitted" state: no error on the emptied fields.
          formDirective.resetForm();
          this.snackBar.open(
            `Demande envoyée : ${this.daysLabel(request.days)}. Votre responsable va la traiter.`,
            'OK',
            { duration: 5000 },
          );
          this.refresh();
        },
        error: (response: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(apiErrorMessage(response));
        },
      });
  }

  /** Cancelling cannot be undone: an approved absence would have to be requested again. */
  protected cancel(request: AbsenceRequest): void {
    if (this.busyId() === request.id) {
      return;
    }
    const approved = request.status === 'APPROVED';
    const summary = this.summary(request);
    confirmAction(this.dialog, {
      title: approved ? 'Annuler votre absence acceptée ?' : 'Annuler votre demande ?',
      message: approved
        ? `${summary}. Cette absence a déjà été acceptée : si vous l’annulez, il faudra refaire une demande et attendre une nouvelle validation pour poser ces jours.`
        : `${summary}. Cette demande n’a pas encore été traitée : elle sera retirée.`,
      confirmLabel: approved ? 'Annuler l’absence' : 'Annuler la demande',
      cancelLabel: approved ? 'Garder l’absence' : 'Garder la demande',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.runAction(request.id, this.absencesService.cancel(request.id), 'Demande annulée.');
      }
    });
  }

  protected approve(request: AbsenceRequest): void {
    if (this.busyId() === request.id) {
      return;
    }
    this.runAction(
      request.id,
      this.absencesService.approve(request.id, this.commentFor(request.id)),
      `Absence de ${fullName(request.employee)} acceptée.`,
    );
  }

  /** A refusal is final: the employee has to send a new request. */
  protected reject(request: AbsenceRequest): void {
    if (this.busyId() === request.id) {
      return;
    }
    const name = fullName(request.employee);
    const comment = this.commentFor(request.id);
    confirmAction(this.dialog, {
      title: `Refuser la demande de ${name} ?`,
      message: `${this.summary(request)}. ${name} verra le refus${
        comment ? ' et votre réponse' : ''
      }, et devra faire une nouvelle demande pour ces dates.`,
      confirmLabel: 'Refuser la demande',
      cancelLabel: 'Retour',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.runAction(
          request.id,
          this.absencesService.reject(request.id, comment),
          `Absence de ${name} refusée.`,
        );
      }
    });
  }

  protected revoke(request: AbsenceRequest): void {
    if (this.busyId() === request.id) {
      return;
    }
    this.dialog
      .open<RevokeDialog, RevokeDialogData, string>(RevokeDialog, {
        data: { employeeName: fullName(request.employee), period: this.period(request) },
        width: '28rem',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((comment) => {
        if (comment) {
          this.runAction(
            request.id,
            this.absencesService.revoke(request.id, comment),
            `Absence de ${fullName(request.employee)} annulée.`,
          );
        }
      });
  }

  protected setComment(id: string, comment: string): void {
    this.reviewComments.update((comments) => ({ ...comments, [id]: comment }));
  }

  protected canCancel(request: AbsenceRequest): boolean {
    const today = todayKey(this.user()?.company.timezone ?? 'Europe/Paris');
    return (
      request.status === 'PENDING' || (request.status === 'APPROVED' && request.startDate > today)
    );
  }

  protected canReview(request: AbsenceRequest): boolean {
    const user = this.user();
    return user !== null && (user.role === 'ADMIN' || request.employee.id !== user.id);
  }

  /** Same rule as the API: a manager never decides on their own absences. */
  protected canRevoke(request: AbsenceRequest): boolean {
    return request.status === 'APPROVED' && this.canReview(request);
  }

  /** "Acceptée par Karim Benali : « Bonnes vacances »", or who cancelled it. */
  protected decisionLabel(request: AbsenceRequest): string | null {
    const reviewer = request.reviewedBy;
    if (!reviewer || request.status === 'PENDING') {
      return null;
    }
    if (request.status === 'CANCELLED' && reviewer.id === this.user()?.id) {
      return 'Vous avez annulé cette demande.';
    }
    const verb = { APPROVED: 'Acceptée', REJECTED: 'Refusée', CANCELLED: 'Annulée' }[
      request.status
    ];
    const comment = request.reviewComment ? ` : « ${request.reviewComment} »` : '';
    return `${verb} par ${fullName(reviewer)}${comment}`;
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

  /** "Congés payés du 21 sept. 2026 au 25 sept. 2026", for the confirmations. */
  private summary(request: AbsenceRequest): string {
    const period = this.period(request);
    return `${this.typeLabels[request.type]} ${period.charAt(0).toLowerCase()}${period.slice(1)}`;
  }

  private commentFor(id: string): string | undefined {
    return this.reviewComments()[id]?.trim() || undefined;
  }

  /** After an action, the lists refresh without blinking. */
  private refresh(): void {
    this.loadMine(true);
    if (this.isManager()) {
      this.loadTeam(true);
    }
  }

  private runAction(id: string, request: Observable<unknown>, successMessage: string): void {
    this.busyId.set(id);
    this.error.set(null);

    request.subscribe({
      next: () => {
        this.busyId.set(null);
        this.snackBar.open(successMessage, 'OK', { duration: 4000 });
        this.refresh();
      },
      error: (response: HttpErrorResponse) => {
        this.busyId.set(null);
        this.error.set(apiErrorMessage(response));
      },
    });
  }
}
