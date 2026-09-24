import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/** Application roles allowed on a route; they come from the database, not from Keycloak. */
export const ROLES_METADATA = 'roles';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_METADATA, roles);
