#!/bin/sh
# Restores an encrypted backup into the production database: after an
# incident, on a new server, or to go back to the previous release when its
# migrations must be undone. The current database is saved first
# (pre-restore-<date>.dump.enc, same encryption), then dropped and created again
# from the dump, with its owner, rights and settings (pg_restore --create).
#
# From /srv/workhoraire, with C="docker compose -f docker-compose.prod.yml --env-file .env.production":
#   1. $C stop api keycloak                      nothing may write meanwhile
#   2. $C exec backup restore.sh                 the latest backup, or a file name:
#      $C exec backup restore.sh workhoraire-<date>.dump.enc
#   3. back to the previous release:  bash infrastructure/server/deploy.sh <previous version>
#      same release (incident):       $C start keycloak api
# To undo the restore itself: restore.sh pre-restore-<date>.dump.enc
set -eu

: "${PGDATABASE:?PGDATABASE must be set}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE must be set}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
umask 077

if [ -n "${1:-}" ]; then
  dump="$BACKUP_DIR/$(basename "$1")"
else
  # shellcheck disable=SC2012 # the names have no spaces; newest first
  dump="$(ls -1t "$BACKUP_DIR"/workhoraire-*.dump.enc 2> /dev/null | head -n 1 || true)"
fi
if [ -z "$dump" ] || [ ! -f "$dump" ]; then
  echo "No backup found in $BACKUP_DIR" >&2
  exit 1
fi

sql() {
  psql -At -v ON_ERROR_STOP=1 -d postgres -c "$1"
}

connected="$(sql "SELECT count(*) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND usename <> current_user")"
if [ "$connected" != 0 ]; then
  echo "$connected connection(s) still open on $PGDATABASE: stop the API and Keycloak first." >&2
  exit 1
fi
# The dump gives their tables and rights back to the roles of init-prod/01-roles.sh.
for role in keycloak workhoraire_api; do
  if [ "$(sql "SELECT count(*) FROM pg_roles WHERE rolname = '$role'")" != 1 ]; then
    echo "Role $role is missing: run infrastructure/server/deploy.sh once (it creates the roles), then restore." >&2
    exit 1
  fi
done

work="$(mktemp -d)"
safety=""
trap 'rm -rf "$work"; if [ -n "$safety" ]; then rm -f "$safety.tmp"; fi' EXIT
trap 'exit 1' HUP INT TERM

# Decrypted and read before anything is dropped: a wrong passphrase or a
# damaged file stops here, the database untouched.
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -pass env:BACKUP_PASSPHRASE -in "$dump" -out "$work/restore.dump"
archive_db="$(pg_restore --list "$work/restore.dump" | sed -n 's/^;[[:space:]]*dbname: //p')"
if [ "$archive_db" != "$PGDATABASE" ]; then
  echo "$(basename "$dump") holds the database '$archive_db', not '$PGDATABASE'." >&2
  exit 1
fi

if [ "$(sql "SELECT count(*) FROM pg_database WHERE datname = '$PGDATABASE'")" = 1 ]; then
  safety="$BACKUP_DIR/pre-restore-$(date -u +%Y%m%dT%H%M%SZ).dump.enc"
  pg_dump --format=custom --file="$work/current.dump"
  openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt \
    -pass env:BACKUP_PASSPHRASE -in "$work/current.dump" -out "$safety.tmp"
  mv "$safety.tmp" "$safety"
  rm -f "$work/current.dump"
  echo "Current database saved first: $(basename "$safety")"
  # Fails, without any change, if a connection opened meanwhile.
  sql "DROP DATABASE \"$PGDATABASE\"" > /dev/null
fi

echo "Restoring $(basename "$dump") into $PGDATABASE…"
pg_restore --create --exit-on-error --dbname=postgres "$work/restore.dump"

C="docker compose -f docker-compose.prod.yml --env-file .env.production"
echo "Restored. Next, from /srv/workhoraire:"
echo "  - back to the previous release: bash infrastructure/server/deploy.sh <previous version>"
echo "  - same release (incident):      $C start keycloak api"
if [ -n "$safety" ]; then
  echo "To undo this restore: $C exec backup restore.sh $(basename "$safety")"
fi
