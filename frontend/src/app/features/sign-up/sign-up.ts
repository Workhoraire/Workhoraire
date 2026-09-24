import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { rememberOffer } from '../../core/billing/chosen-offer';

/**
 * Target of the website's sign-up links (/inscription?offre=essentiel): keeps
 * the chosen offer, then opens the Keycloak sign-up page. Back from Keycloak,
 * the company creation follows, then the subscription page for Essentiel.
 */
@Component({
  selector: 'app-sign-up',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="wh-loading" role="status">
      <mat-spinner diameter="28" aria-hidden="true" />
      <span>Ouverture de l’inscription…</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  constructor() {
    const authService = inject(AuthService);
    rememberOffer(inject(ActivatedRoute).snapshot.queryParamMap.get('offre'));

    if (authService.authenticated()) {
      void inject(Router).navigateByUrl('/');
    } else {
      void authService.register().catch(() => undefined);
    }
  }
}
