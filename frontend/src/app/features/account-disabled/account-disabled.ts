import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth/auth.service';

/** Shown to an employee whose account was deactivated by an administrator. */
@Component({
  selector: 'app-account-disabled',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="invitation-shell">
      <header class="topbar">
        <span class="brand">
          <span class="brand-mark" aria-hidden="true">WH</span>
          <span class="brand-name">WorkHoraire</span>
        </span>
      </header>

      <main class="invitation-content">
        <mat-card class="invitation-card">
          <div class="state-icon error-icon"><mat-icon aria-hidden="true">lock</mat-icon></div>
          <p class="eyebrow">ACCÈS SUSPENDU</p>
          <h1>Votre compte est désactivé.</h1>
          <p>
            Votre employeur a désactivé votre accès à WorkHoraire. Les heures déjà enregistrées sont
            conservées. Pour toute question, contactez l’administrateur de votre entreprise.
          </p>
          <div class="invitation-actions">
            <button mat-flat-button type="button" (click)="logout()">Se déconnecter</button>
          </div>
        </mat-card>
      </main>
    </div>
  `,
  // Same layout as the invitation page.
  styleUrl: '../employees/employee-invitation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDisabled {
  private readonly authService = inject(AuthService);

  protected logout(): void {
    void this.authService.logout();
  }
}
