import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { UserRole } from '../../core/auth/auth.models';
import { apiErrorMessage } from '../../core/http/error-message';
import { formatDuration, formatShortDate, startOfWeek } from '../../core/time/time-format';
import {
  CreateEmployeeInvitationRequest,
  Employee,
  EmployeeInvitation,
  UpdateEmployeeRequest,
} from './employee.models';
import { EmployeesService } from './employees.service';

@Component({
  selector: 'app-employees',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employees {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeesService = inject(EmployeesService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly savingEmployeeId = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);
  protected readonly invitationLink = signal<string | null>(null);
  protected readonly copied = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected readonly roles: readonly UserRole[] = ['ADMIN', 'MANAGER', 'EMPLOYEE'];

  protected readonly inviteForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
    role: ['EMPLOYEE' as UserRole, [Validators.required]],
    weeklyHours: [35, [Validators.required, Validators.min(1), Validators.max(48)]],
  });

  protected readonly editForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
    role: ['EMPLOYEE' as UserRole, [Validators.required]],
    weeklyHours: [35, [Validators.required, Validators.min(1), Validators.max(48)]],
    /** Optional date from which a contract change applies. */
    contractFrom: [''],
    payrollId: ['', [Validators.maxLength(50)]],
  });

  constructor() {
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(this.errorMessage(response));
      },
    });
  }

  protected inviteEmployee(formDirective: FormGroupDirective): void {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const values = this.inviteForm.getRawValue();
    const payload: CreateEmployeeInvitationRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      weeklyContractMinutes: Math.round(values.weeklyHours * 60),
    };

    this.saving.set(true);
    this.error.set(null);
    this.notice.set(null);

    this.employeesService.createInvitation(payload).subscribe({
      next: (invitation) => {
        this.saving.set(false);
        this.invitationLink.set(
          `${window.location.origin}/employee-invitations/${encodeURIComponent(invitation.token)}`,
        );
        this.copied.set(false);
        this.notice.set(
          invitation.replacesPrevious
            ? `Nouveau lien créé pour ${invitation.firstName} ${invitation.lastName} : l’ancien lien ne fonctionne plus.`
            : `Invitation créée pour ${invitation.firstName} ${invitation.lastName}.`,
        );
        // resetForm also clears the "submitted" state: no error on the emptied fields.
        formDirective.resetForm({
          firstName: '',
          lastName: '',
          email: '',
          role: 'EMPLOYEE',
          weeklyHours: 35,
        });
      },
      error: (response: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(this.errorMessage(response));
      },
    });
  }

  protected startEditing(employee: Employee): void {
    this.editingId.set(employee.id);
    this.error.set(null);
    this.editForm.setValue({
      firstName: employee.firstName ?? '',
      lastName: employee.lastName ?? '',
      email: employee.email ?? '',
      role: employee.role,
      weeklyHours: employee.weeklyContractMinutes / 60,
      contractFrom: '',
      payrollId: employee.payrollId ?? '',
    });
  }

  protected cancelEditing(): void {
    this.editingId.set(null);
    this.editForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      role: 'EMPLOYEE',
      weeklyHours: 35,
      contractFrom: '',
      payrollId: '',
    });
  }

  protected saveEmployee(employee: Employee): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const values = this.editForm.getRawValue();
    const weeklyContractMinutes = Math.round(values.weeklyHours * 60);
    // The contract is only sent when it changes, or to date a change: each
    // change is recorded from a Monday, past weeks keep the former contract.
    const contractChange =
      weeklyContractMinutes !== employee.weeklyContractMinutes || values.contractFrom !== '';
    const payload: UpdateEmployeeRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      payrollId: values.payrollId.trim(),
      ...(contractChange ? { weeklyContractMinutes } : {}),
      ...(contractChange && values.contractFrom ? { contractEffectiveFrom: values.contractFrom } : {}),
    };

    this.savingEmployeeId.set(employee.id);
    this.error.set(null);

    this.employeesService.updateEmployee(employee.id, payload).subscribe({
      next: (updatedEmployee) => {
        this.savingEmployeeId.set(null);
        this.replaceEmployee(updatedEmployee);
        this.cancelEditing();
        this.notice.set(
          contractChange
            ? `Informations mises à jour. Contrat de ${formatDuration(weeklyContractMinutes)} par semaine ${
                values.contractFrom
                  ? `à partir de la semaine du ${formatShortDate(startOfWeek(values.contractFrom))}`
                  : 'dès cette semaine'
              }.`
            : 'Les informations de l’employé ont été mises à jour.',
        );
      },
      error: (response: HttpErrorResponse) => {
        this.savingEmployeeId.set(null);
        this.error.set(this.errorMessage(response));
      },
    });
  }

  protected toggleActive(employee: Employee): void {
    this.savingEmployeeId.set(employee.id);
    this.error.set(null);

    this.employeesService
      .updateEmployee(employee.id, { isActive: !employee.isActive })
      .subscribe({
        next: (updatedEmployee) => {
          this.savingEmployeeId.set(null);
          this.replaceEmployee(updatedEmployee);
          this.notice.set(
            updatedEmployee.isActive
              ? 'L’employé a été réactivé.'
              : 'L’employé a été désactivé.',
          );
        },
        error: (response: HttpErrorResponse) => {
          this.savingEmployeeId.set(null);
          this.error.set(this.errorMessage(response));
        },
      });
  }

  protected async copyInvitationLink(): Promise<void> {
    const link = this.invitationLink();
    if (!link || !navigator.clipboard) {
      this.error.set('La copie automatique n’est pas disponible dans ce navigateur.');
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      this.copied.set(true);
    } catch {
      this.error.set('Le lien n’a pas pu être copié automatiquement.');
    }
  }

  protected contractLabel(minutes: number): string {
    return `${formatDuration(minutes)} / semaine`;
  }

  protected fullName(employee: Employee): string {
    return [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Employé sans nom';
  }

  protected initials(employee: Employee): string {
    const initials = [employee.firstName, employee.lastName]
      .filter(Boolean)
      .map((value) => value![0])
      .join('');

    return initials.toUpperCase() || 'E';
  }

  protected roleLabel(role: UserRole): string {
    return {
      ADMIN: 'Administrateur',
      MANAGER: 'Manager',
      EMPLOYEE: 'Employé',
    }[role];
  }

  protected statusLabel(isActive: boolean): string {
    return isActive ? 'Actif' : 'Inactif';
  }

  private replaceEmployee(updatedEmployee: Employee): void {
    this.employees.update((employees) =>
      employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee,
      ),
    );
  }

  private errorMessage(response: HttpErrorResponse): string {
    if (response.status === 403 && !response.error?.message?.includes('own account')) {
      return 'L’accès à la gestion des employés est réservé aux administrateurs.';
    }
    return apiErrorMessage(response);
  }
}
