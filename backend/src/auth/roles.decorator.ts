import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const KEYCLOAK_ROLES_METADATA = 'keycloak_roles';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(KEYCLOAK_ROLES_METADATA, roles);
