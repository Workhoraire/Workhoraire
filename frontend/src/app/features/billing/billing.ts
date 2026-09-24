import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';

import { apiErrorMessage } from '../../core/http/error-message';
import { CurrentUserService } from '../../core/user/current-user.service';
import { formatDeadline, formatEuros, formatMonth } from './billing-format';
import { BillingOverview, PlanCode, SubscriptionStatus } from './billing.models';
import { BillingService } from './billing.service';

const PLAN_LABELS: Record<PlanCode, string> = {
  DECOUVERTE: 'Découverte',
  ESSENTIEL: 'Essentiel',
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  NONE: 'Sans moyen de paiement',
  ACTIVE: 'Abonnement actif',
  PAST_DUE: 'Paiement en échec',
  CANCELED: 'Abonnement résilié',
};

/** Subscription of the company: usage of the month, amount, payment through Stripe. */
@Component({
  selector: 'app-billing',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Billing {
  private readonly billingService = inject(BillingService);
  private readonly route = inject(ActivatedRoute);
  private readonly currentUser = toSignal(
    inject(CurrentUserService).getCurrentUser().pipe(catchError(() => of(null))),
    { initialValue: null },
  );

  protected readonly overview = signal<BillingOverview | null>(null);
  protected readonly loading = signal(true);
  protected readonly redirecting = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Back from Stripe Checkout: the webhook may take a few seconds. */
  protected readonly paymentConfirmed =
    this.route.snapshot.queryParamMap.get('paiement') === 'ok';

  protected readonly planLabels = PLAN_LABELS;
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly euros = formatEuros;
  protected readonly monthLabel = formatMonth;

  protected readonly deadline = computed(() => {
    const graceUntil = this.overview()?.graceUntil;
    return graceUntil
      ? formatDeadline(graceUntil, this.currentUser()?.company.timezone ?? 'Europe/Paris')
      : null;
  });

  /** A new subscription, unless one is running or has an unpaid invoice (fixed in the portal). */
  protected readonly canSubscribe = computed(() => {
    const overview = this.overview();
    return (
      !!overview &&
      overview.paymentsEnabled &&
      overview.status !== 'ACTIVE' &&
      overview.status !== 'PAST_DUE'
    );
  });

  constructor() {
    this.load();
    if (this.paymentConfirmed) {
      setTimeout(() => this.load(), 4000);
    }
  }

  protected subscribe(): void {
    this.redirect(this.billingService.createCheckout());
  }

  protected openPortal(): void {
    this.redirect(this.billingService.createPortal());
  }

  private load(): void {
    this.billingService.getOverview().subscribe({
      next: (overview) => {
        this.overview.set(overview);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(apiErrorMessage(response, 'L’abonnement n’a pas pu être chargé.'));
        this.loading.set(false);
      },
    });
  }

  private redirect(request: Observable<{ url: string }>): void {
    this.redirecting.set(true);
    this.error.set(null);
    request.subscribe({
      next: ({ url }) => window.location.assign(url),
      error: (response: HttpErrorResponse) => {
        this.redirecting.set(false);
        this.error.set(apiErrorMessage(response, 'La page de paiement n’a pas pu être ouverte.'));
      },
    });
  }
}
