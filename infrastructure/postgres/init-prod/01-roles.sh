#!/bin/sh
# Production database roles. Run by the postgres image when the data volume is
# empty, then by infrastructure/server/deploy.sh at every deployment: it can be
# run any number of times, and the roles always end up with the passwords of
# .env.production (a password changed there is applied at the next deployment).
#   - the owner (POSTGRES_USER) migrates and backs up;
#   - keycloak owns its schema and sees nothing else;
#   - workhoraire_api reads and writes the application tables, without DDL and
#     without Keycloak's schema (signing keys, password hashes), and can only
#     add to the audit trail of corrections ("TimeEntryAuditLog"): closed
#     accounts are deleted with the owner's rights (migrate service).
#
#   docker compose -f docker-compose.prod.yml --env-file .env.production \
#     exec -T postgres sh /docker-entrypoint-initdb.d/01-roles.sh
#
# The subshell keeps `set -eu` to this script when the image's entrypoint
# sources it (it does so when the file is not executable).
(
  set -eu

  : "${POSTGRES_USER:?POSTGRES_USER must be set}"
  : "${POSTGRES_DB:?POSTGRES_DB must be set}"
  : "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set}"
  : "${KEYCLOAK_DB_PASSWORD:?KEYCLOAK_DB_PASSWORD must be set}"
  : "${API_DB_PASSWORD:?API_DB_PASSWORD must be set}"

  # Local socket, as the owner. The passwords are read from the environment by
  # psql itself (\getenv), never passed on a command line.
  psql -q -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    -v owner="$POSTGRES_USER" -v dbname="$POSTGRES_DB" <<'SQL'
\getenv owner_password POSTGRES_PASSWORD
\getenv keycloak_password KEYCLOAK_DB_PASSWORD
\getenv api_password API_DB_PASSWORD

SELECT NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'keycloak') AS create_keycloak,
       NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workhoraire_api') AS create_api \gset
\if :create_keycloak
CREATE ROLE keycloak LOGIN;
\endif
\if :create_api
CREATE ROLE workhoraire_api LOGIN;
\endif
ALTER ROLE :"owner" WITH PASSWORD :'owner_password';
ALTER ROLE keycloak WITH LOGIN PASSWORD :'keycloak_password';
ALTER ROLE workhoraire_api WITH LOGIN PASSWORD :'api_password';

CREATE SCHEMA IF NOT EXISTS keycloak AUTHORIZATION keycloak;
REVOKE ALL ON SCHEMA keycloak FROM PUBLIC;
GRANT CONNECT ON DATABASE :"dbname" TO keycloak, workhoraire_api;

GRANT USAGE ON SCHEMA public TO workhoraire_api;
-- Tables and sequences created later by the migrations (run by the owner)...
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO workhoraire_api;
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO workhoraire_api;
-- ...and those that already exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO workhoraire_api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workhoraire_api;

-- The audit trail of corrections: the API reads it and adds to it, never
-- rewrites or deletes it. The table appears with the first migrations, hence
-- the second run of this script by deploy.sh, after them.
SELECT to_regclass('public."TimeEntryAuditLog"') IS NOT NULL AS has_audit_log \gset
\if :has_audit_log
REVOKE UPDATE, DELETE ON public."TimeEntryAuditLog" FROM workhoraire_api;
\endif
SQL
)
