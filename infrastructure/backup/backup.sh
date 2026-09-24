#!/bin/sh
# Encrypted dump of the whole database (WorkHoraire and Keycloak schemas).
#   backup.sh            one dump now
#   backup.sh --daemon   one dump at start-up, then on the BACKUP_CRON schedule
#                        (default: every day at 03:00 UTC)
# Dumps (and the pre-restore safety dumps of restore.sh) older than
# BACKUP_RETENTION_DAYS are removed.
#
# A backup on the same disk is not a backup: with BACKUP_OFFSITE set to an
# rclone remote ("offsite:bucket/folder", the remote being configured by the
# RCLONE_CONFIG_OFFSITE_* variables), every dump is also copied there, already
# encrypted. The server never deletes those copies: give it a key that can only
# write, and let a lifecycle rule of the bucket expire them. Only with
# BACKUP_OFFSITE_PRUNE=true does it delete the copies older than the retention.
# A failed copy is a warning, not a failure: the local dump is there.
#
# BACKUP_HEARTBEAT_URL (a "dead man's switch", e.g. a healthchecks.io check
# expecting one ping a day) is called only after a complete success: the local
# dump, and the off-site copy when there is one. A missing ping raises the alert.
set -eu

: "${PGHOST:?PGHOST must be set}"
: "${PGUSER:?PGUSER must be set}"
: "${PGPASSWORD:?PGPASSWORD must be set}"
: "${PGDATABASE:?PGDATABASE must be set}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE must be set}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
SCHEDULE="${BACKUP_CRON:-0 3 * * *}"

umask 077
mkdir -p "$BACKUP_DIR"

if [ "${1:-}" = "--daemon" ]; then
  # Cron jobs do not inherit the container variables: keep them in a private file.
  env | grep -E '^(PG|BACKUP_|RCLONE_)' | sed "s/'/'\\\\''/g; s/=\(.*\)/='\1'/; s/^/export /" > /etc/backup.env
  echo "$SCHEDULE . /etc/backup.env && /usr/local/bin/backup.sh >> /proc/1/fd/1 2>> /proc/1/fd/2" > /etc/crontabs/root

  # After a reboot, the database may still be starting.
  for _ in $(seq 1 30); do
    if pg_isready -q; then
      break
    fi
    sleep 2
  done
  # A separate process, so that its first failing command stops it (set -e).
  /usr/local/bin/backup.sh || echo "$(date -u +%FT%TZ) ÉCHEC de la sauvegarde" >&2
  exec crond -f -l 8
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$BACKUP_DIR/workhoraire-$stamp.dump.enc"
work="$(mktemp -d)"
# Whatever happens, neither the plain dump nor a partial file is left behind.
trap 'rm -rf "$work" "$target.tmp"' EXIT
trap 'exit 1' HUP INT TERM

# Owners and rights are kept: restored, Keycloak owns its schema again and
# the API keeps its read and write rights (init-prod/01-roles.sh).
pg_dump --format=custom --file="$work/dump"
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt \
  -pass env:BACKUP_PASSPHRASE -in "$work/dump" -out "$target.tmp"
mv "$target.tmp" "$target"
find "$BACKUP_DIR" \( -name 'workhoraire-*.dump.enc' -o -name 'pre-restore-*.dump.enc' \) \
  -mtime "+$RETENTION_DAYS" -delete
echo "$(date -u +%FT%TZ) sauvegarde écrite : $(basename "$target") ($(du -h "$target" | cut -f1))"

complete=true
if [ -n "${BACKUP_OFFSITE:-}" ]; then
  # The flags let a key that can only write (no listing, no reading, no
  # bucket creation) do the copy.
  if rclone copyto --s3-no-check-bucket --no-check-dest --s3-no-head \
    "$target" "$BACKUP_OFFSITE/$(basename "$target")" \
    && { [ "${BACKUP_OFFSITE_PRUNE:-false}" != true ] \
      || rclone delete "$BACKUP_OFFSITE" --min-age "${RETENTION_DAYS}d" --include 'workhoraire-*.dump.enc'; }; then
    echo "$(date -u +%FT%TZ) copie hors serveur : $BACKUP_OFFSITE/$(basename "$target")"
  else
    echo "$(date -u +%FT%TZ) ATTENTION : échec de la copie hors serveur ($BACKUP_OFFSITE) ; la sauvegarde locale est faite" >&2
    complete=false
  fi
fi

if [ "$complete" = true ] && [ -n "${BACKUP_HEARTBEAT_URL:-}" ]; then
  wget -q -T 20 -O /dev/null "$BACKUP_HEARTBEAT_URL" \
    || echo "$(date -u +%FT%TZ) ATTENTION : signal de vie non envoyé (BACKUP_HEARTBEAT_URL)" >&2
fi
