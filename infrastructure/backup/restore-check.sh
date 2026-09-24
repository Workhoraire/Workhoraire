#!/bin/sh
# Monthly restore test: restores the latest encrypted dump into a temporary
# database, checks what it contains, then drops it. The production database is
# never touched. Exits with an error, and never reports a success, if the dump
# cannot be decrypted or restored, if an application table is missing, or if
# there is no company or no user in it.
set -eu

: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE must be set}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
CHECK_DB="workhoraire_restore_check"

# shellcheck disable=SC2012 # the names have no spaces; newest first
latest="$(ls -1t "$BACKUP_DIR"/workhoraire-*.dump.enc 2>/dev/null | head -n 1 || true)"
if [ -z "$latest" ]; then
  echo "Aucune sauvegarde dans $BACKUP_DIR" >&2
  exit 1
fi

work="$(mktemp -d)"
trap 'rm -rf "$work"; psql -q -d postgres -c "DROP DATABASE IF EXISTS $CHECK_DB" >/dev/null 2>&1 || true' EXIT
trap 'exit 1' HUP INT TERM

openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -pass env:BACKUP_PASSPHRASE -in "$latest" -out "$work/dump"
psql -q -v ON_ERROR_STOP=1 -d postgres \
  -c "DROP DATABASE IF EXISTS $CHECK_DB" -c "CREATE DATABASE $CHECK_DB"
pg_restore --no-owner --exit-on-error --dbname="$CHECK_DB" "$work/dump"

count() {
  psql -v ON_ERROR_STOP=1 -d "$CHECK_DB" -At -c "SELECT count(*) FROM $1"
}
# Each count fails the script if its table is missing from the dump.
companies="$(count '"Company"')"
users="$(count '"User"')"
entries="$(count '"TimeEntry"')"
corrections="$(count '"TimeEntryAuditLog"')"
accounts="$(count 'keycloak.user_entity')"

if [ "$companies" = 0 ] || [ "$users" = 0 ]; then
  echo "Échec : la sauvegarde $(basename "$latest") ne contient aucune entreprise ou aucun utilisateur." >&2
  exit 1
fi

echo "Restauration réussie de $(basename "$latest") :"
echo "  entreprises : $companies, utilisateurs : $users, pointages : $entries,"
echo "  corrections tracées : $corrections, comptes Keycloak : $accounts."
