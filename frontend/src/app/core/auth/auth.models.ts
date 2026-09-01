export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface CurrentUser {
  id: string;
  subject: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  role: UserRole;
  company: {
    id: string;
    name: string;
  };
}
