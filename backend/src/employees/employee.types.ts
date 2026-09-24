import { UserRole } from '@prisma/client';

export interface EmployeeResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isActive: boolean;
  role: UserRole;
  weeklyContractMinutes: number;
  payrollId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeInvitationResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  weeklyContractMinutes: number;
  token: string;
  expiresAt: Date;
  /** True when this link replaces a previous one, which no longer works. */
  replacesPrevious: boolean;
  /** True when the link was also sent by e-mail to the invited address. */
  emailSent: boolean;
}

/** What an invitation link shows before the invited person signs in. */
export interface EmployeeInvitationPreview {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyName: string;
  expiresAt: Date;
}
