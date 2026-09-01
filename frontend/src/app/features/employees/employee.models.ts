import { UserRole } from '../../core/auth/auth.models';

export interface Employee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInvitationRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface EmployeeInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
  expiresAt: string;
}
