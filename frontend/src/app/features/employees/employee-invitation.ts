import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { EmployeeInvitationService, InvitationPreview } from './employee-invitation.service';
import { InvitationProblem, invitationProblem } from './invitation-problem';

type InvitationState = 'loading' | 'welcome' | 'success' | 'error';

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
  private readonly currentUserService = inject(CurrentUserService);
  private readonly authService = inject(AuthService);

  protected readonly authenticated = this.authService.authenticated;
  protected readonly state = signal<InvitationState>('loading');
  protected readonly preview = signal<InvitationPreview | null>(null);
  protected readonly problem = signal<InvitationProblem | null>(null);
  /** Company of the signed-in account, when it already has one to go back to. */
  protected readonly homeCompany = signal<string | null>(null);
  private readonly token = this.route.snapshot.paramMap.get('token');

  constructor() {
    this.retry();
  }

  /** Signed in: join the company. Not yet: welcome the person and let them choose a password. */
  protected retry(): void {
    if (!this.token) {
      this.state.set('error');
      this.problem.set({
        kind: 'not-found',
        message: 'Le lien d’invitation est incomplet.',
        canSwitchAccount: false,
        canRetry: false,
      });
      return;
    }

    this.state.set('loading');
    this.problem.set(null);

    if (this.authService.authenticated()) {
      this.accept(this.token);
    } else {
      this.welcome(this.token);
    }
  }

  /** Keycloak sign-up page, with the invited address already filled in: only the password is left. */
  protected createPassword(): void {
    void this.authService.register(this.preview()?.email);
  }

  protected signIn(): void {
    void this.authService.login(this.preview()?.email);
  }

  /** Signs out, then comes back to this link to sign in or register with the invited address. */
  protected switchAccount(): void {
    void this.authService.logout(window.location.href);
  }

  private welcome(token: string): void {
    this.invitationService.getInvitation(token).subscribe({
      next: (preview) => {
        this.preview.set(preview);
        this.state.set('welcome');
      },
      error: (response: HttpErrorResponse) => {
        this.state.set('error');
        this.problem.set(invitationProblem(response, null));
      },
    });
  }

  private accept(token: string): void {
    this.invitationService.acceptInvitation(token).subscribe({
      next: () => {
        this.state.set('success');
        window.setTimeout(() => void this.router.navigateByUrl('/'), 700);
      },
      error: (response: HttpErrorResponse) => {
        this.state.set('error');
        this.problem.set(invitationProblem(response, this.authService.email()));
        this.findHomeCompany();
      },
    });
  }

  private findHomeCompany(): void {
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => this.homeCompany.set(user.company.name),
      error: () => this.homeCompany.set(null),
    });
  }
}
