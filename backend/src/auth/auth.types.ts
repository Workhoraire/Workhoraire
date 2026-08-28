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
