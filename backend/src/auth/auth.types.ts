import { Company, User } from '@prisma/client';
import { Request } from 'express';

export interface KeycloakUser {
  sub: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
}

export type ApplicationUser = User & {
  company: Company;
};

export interface ApplicationUserResponse {
  id: string;
  subject: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  role: User['role'];
  weeklyContractMinutes: number;
  company: {
    id: string;
    name: string;
    timezone: string;
  };
}

export function toApplicationUserResponse(
  user: User,
  company: Pick<Company, 'id' | 'name' | 'timezone'>,
): ApplicationUserResponse {
  return {
    id: user.id,
    subject: user.keycloakSubject,
    email: user.email ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    isActive: user.isActive,
    role: user.role,
    weeklyContractMinutes: user.weeklyContractMinutes,
    company: {
      id: company.id,
      name: company.name,
      timezone: company.timezone,
    },
  };
}

export interface KeycloakRequest extends Request {
  /** Claims of the verified access token (KeycloakAuthGuard). */
  user?: KeycloakUser;
  applicationUser?: ApplicationUser;
}
