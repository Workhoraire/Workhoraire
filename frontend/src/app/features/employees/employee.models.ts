import { UserRole } from '../../core/auth/auth.models';

export interface Employee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isActive: boolean;
  role: UserRole;
  weeklyContractMinutes: number;
  payrollId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInvitationRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  weeklyContractMinutes: number;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  weeklyContractMinutes?: number;
  /**
   * "YYYY-MM-DD": the new contract applies from the Monday of that week, past
   * weeks keep the former one. Default: the current week.
   */
  contractEffectiveFrom?: string;
  /** An empty string removes the payroll number. */
  payrollId?: string;
}

export interface EmployeeInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  weeklyContractMinutes: number;
  token: string;
  expiresAt: string;
  /** True when this link replaces a previous one, which no longer works. */
  replacesPrevious: boolean;
}
