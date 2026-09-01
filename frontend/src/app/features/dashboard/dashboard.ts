import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { CurrentUser, UserRole } from '../../core/auth/auth.models';
import { CurrentUserService } from '../../core/user/current-user.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly currentUserService = inject(CurrentUserService);

  protected readonly user = signal<CurrentUser | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  protected loadCurrentUser(): void {
    this.loading.set(true);
    this.error.set(null);

    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(
          response.status === 403 &&
          response.error?.message === 'The application user is inactive'
            ? 'Votre compte est désactivé. Contactez un administrateur.'
            : response.status === 403
            ? "Votre compte Keycloak n'est pas encore rattaché à une entreprise."
            : response.status === 401
              ? 'Votre session a expiré. Reconnectez-vous pour continuer.'
              : "Le profil n'a pas pu être chargé. Vérifiez que le backend est démarré.",
        );
      },
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
  }

  protected greeting(user: CurrentUser): string {
    return user.firstName ? `Bonjour, ${user.firstName}` : 'Bonjour';
  }

  protected fullName(user: CurrentUser): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Utilisateur WorkHoraire';
  }

  protected roleLabel(role: UserRole): string {
    return {
      ADMIN: 'Administrateur',
      MANAGER: 'Manager',
      EMPLOYEE: 'Employé',
    }[role];
  }
}
