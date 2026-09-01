import { UserRole } from '@prisma/client';

export interface EmployeeResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeInvitationResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
  expiresAt: Date;
}
