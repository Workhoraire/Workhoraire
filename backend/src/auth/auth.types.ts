import { Company, User } from '@prisma/client';
import { Request } from 'express';

export interface KeycloakUser {
  sub: string;
  preferred_username?: string;
  email?: string;
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
  company: {
    id: string;
    name: string;
  };
}

interface KeycloakAccessToken {
  content: KeycloakUser;
}

interface KeycloakGrant {
  access_token?: KeycloakAccessToken;
}

export interface KeycloakRequest extends Request {
  kauth?: {
    grant?: KeycloakGrant;
  };
  user?: KeycloakUser;
  applicationUser?: ApplicationUser;
}
