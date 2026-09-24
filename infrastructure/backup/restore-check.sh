#!/bin/sh
# Monthly restore test: restores the latest encrypted dump into a temporary
# database, checks what it contains, then drops it. The production database is
# never touched. Exits with an error, and never reports a success, if the dump
# cannot be decrypted, restored, or does not contain the application tables.
set -eu

: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE must be set}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
CHECK_DB="workhoraire_restore_check"

latest="$(ls -1t "$BACKUP_DIR"/workhoraire-*.dump.enc 2>/dev/null | head -n 1)"
if [ -z "$latest" ]; then
  echo "Aucune sauvegarde dans $BACKUP_DIR" >&2
  exit 1
fi

plain="$(mktemp)"
trap 'rm -f "$plain"; psql -q -d postgres -c "DROP DATABASE IF EXISTS $CHECK_DB" >/dev/null 2>&1 || true' EXIT

openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -pass env:BACKUP_PASSPHRASE -in "$latest" -out "$plain"
psql -q -v ON_ERROR_STOP=1 -d postgres \
  -c "DROP DATABASE IF EXISTS $CHECK_DB" -c "CREATE DATABASE $CHECK_DB"
pg_restore --no-owner --exit-on-error --dbname="$CHECK_DB" "$plain"

count() {
  psql -v ON_ERROR_STOP=1 -d "$CHECK_DB" -At -c "SELECT count(*) FROM $1"
}
# Each count fails the script if its table is missing from the dump.
companies="$(count '"Company"')"
users="$(count '"User"')"
entries="$(count '"TimeEntry"')"
corrections="$(count '"TimeEntryAuditLog"')"
accounts="$(count 'keycloak.user_entity')"

echo "Restauration réussie de $(basename "$latest") :"
echo "  $companies entreprises, $users salariés, $entries pointages,"
echo "  $corrections corrections tracées, $accounts comptes Keycloak."
