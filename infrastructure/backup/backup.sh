#!/bin/sh
# Encrypted dump of the whole database (WorkHoraire and Keycloak schemas).
#   backup.sh            one dump now
#   backup.sh --daemon   one dump now, then on the BACKUP_CRON schedule
#                        (default: every day at 03:00 UTC)
# Dumps older than BACKUP_RETENTION_DAYS are removed. Copy /backups off the
# server (object storage in another region): a backup on the same disk is not a backup.
set -eu

: "${PGHOST:?PGHOST must be set}"
: "${PGUSER:?PGUSER must be set}"
: "${PGPASSWORD:?PGPASSWORD must be set}"
: "${PGDATABASE:?PGDATABASE must be set}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE must be set}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
SCHEDULE="${BACKUP_CRON:-0 3 * * *}"

run_backup() {
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  target="$BACKUP_DIR/workhoraire-$stamp.dump.enc"
  plain="$(mktemp)"
  # A failed dump stops here, before any file is written in BACKUP_DIR.
  pg_dump --format=custom --no-owner --file="$plain"
  openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt \
    -pass env:BACKUP_PASSPHRASE -in "$plain" -out "$target.tmp"
  rm -f "$plain"
  mv "$target.tmp" "$target"
  find "$BACKUP_DIR" -name 'workhoraire-*.dump.enc' -mtime "+$RETENTION_DAYS" -delete
  echo "$(date -u +%FT%TZ) sauvegarde écrite : $(basename "$target") ($(du -h "$target" | cut -f1))"
}

mkdir -p "$BACKUP_DIR"
if [ "${1:-}" != "--daemon" ]; then
  run_backup
  exit 0
fi

# Cron jobs do not inherit the container variables: keep them in a private file.
umask 077
env | grep -E '^(PG|BACKUP_)' | sed "s/'/'\\\\''/g; s/=\(.*\)/='\1'/; s/^/export /" > /etc/backup.env
echo "$SCHEDULE . /etc/backup.env && /usr/local/bin/backup.sh >> /proc/1/fd/1 2>> /proc/1/fd/2" > /etc/crontabs/root

run_backup || echo "$(date -u +%FT%TZ) ÉCHEC de la sauvegarde" >&2
exec crond -f -l 8
