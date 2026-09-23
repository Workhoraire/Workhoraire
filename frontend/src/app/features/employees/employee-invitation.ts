import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { EmployeeInvitationService } from './employee-invitation.service';

type InvitationState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-employee-invitation',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './employee-invitation.html',
  styleUrl: './employee-invitation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeInvitation {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly invitationService = inject(EmployeeInvitationService);
  private readonly authService = inject(AuthService);

  protected readonly state = signal<InvitationState>('loading');
  protected readonly error = signal<string | null>(null);
  private readonly token = this.route.snapshot.paramMap.get('token');

  constructor() {
    this.acceptInvitation();
  }

  protected acceptInvitation(): void {
    if (!this.token) {
      this.state.set('error');
      this.error.set('Le lien d’invitation est incomplet.');
      return;
    }

    this.state.set('loading');
    this.error.set(null);

    this.invitationService.acceptInvitation(this.token).subscribe({
      next: () => {
        this.state.set('success');
        window.setTimeout(() => void this.router.navigateByUrl('/'), 700);
      },
      error: (response: HttpErrorResponse) => {
        this.state.set('error');
        this.error.set(this.errorMessage(response));
      },
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
  }

  private errorMessage(response: HttpErrorResponse): string {
    if (
      response.status === 403 &&
      response.error?.message === 'The Keycloak email must be verified to accept this invitation'
    ) {
      return 'Confirmez d’abord votre adresse e-mail (lien reçu par e-mail), puis rouvrez l’invitation.';
    }
    if (response.status === 403) {
      return 'Cette invitation ne correspond pas à l’adresse e-mail de votre compte.';
    }
    if (response.status === 404) {
      return 'Cette invitation est introuvable ou n’est plus valide.';
    }
    if (response.status === 409) {
      return 'Cette invitation a déjà été utilisée ou votre compte est déjà rattaché à une entreprise.';
    }
    if (response.status === 410) {
      return 'Cette invitation a expiré. Demandez un nouveau lien à votre administrateur.';
    }
    return 'L’invitation n’a pas pu être acceptée. Vérifiez que le backend est disponible.';
  }
}
