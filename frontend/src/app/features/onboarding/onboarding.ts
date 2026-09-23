import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { OnboardingService } from './onboarding.service';

@Component({
  selector: 'app-onboarding',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Onboarding {
  private readonly formBuilder = inject(FormBuilder);
  private readonly onboardingService = inject(OnboardingService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly submitting = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(120)],
    ],
    siret: ['', [Validators.pattern(/^\d{14}$/)]],
    timezone: ['Europe/Paris', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(64)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, siret, timezone } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    this.onboardingService
      .createCompany({
        name: name.trim(),
        siret: siret || undefined,
        timezone: timezone.trim(),
      })
      .subscribe({
        next: () => {
          this.success.set(true);
          void this.router.navigateByUrl('/');
        },
        error: (response: HttpErrorResponse) => {
          this.submitting.set(false);
          this.error.set(this.errorMessage(response));
        },
      });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
  }

  private errorMessage(response: HttpErrorResponse): string {
    if (response.status === 409) {
      return 'Votre compte est déjà rattaché à une entreprise, ou ce SIRET est déjà utilisé.';
    }

    if (response.status === 400) {
      const messages = response.error?.message;
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
      }

      if (typeof messages === 'string') {
        return messages;
      }

      return 'Vérifiez les informations saisies puis réessayez.';
    }

    if (response.status === 401) {
      return 'Votre session a expiré. Reconnectez-vous pour continuer.';
    }

    return "L'entreprise n'a pas pu être créée. Vérifiez que le backend est disponible.";
  }
}
