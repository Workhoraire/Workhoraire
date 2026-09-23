export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface CurrentUser {
  id: string;
  subject: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  role: UserRole;
  weeklyContractMinutes: number;
  company: {
    id: string;
    name: string;
    timezone: string;
  };
}

export function isManagerRole(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MANAGER';
}
