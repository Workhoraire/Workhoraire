#!/usr/bin/env bash
# Deploys WorkHoraire on the server, as the deploy account, from the clone in
# /srv/workhoraire: checks .env.production, checks out the version, validates
# the proxy configuration, builds, backs the database up when the stack is
# already running, applies the database roles, starts, reloads the proxy,
# then checks the API, Keycloak and the public addresses through the proxy.
#
#   bash infrastructure/server/deploy.sh            # main (its latest commit)
#   bash infrastructure/server/deploy.sh v1.2.0     # a tag, a branch or a commit
set -euo pipefail

cd "$(dirname "$0")/../.."
COMPOSE=(docker compose -f docker-compose.prod.yml --env-file .env.production)

# One deployment at a time, by hand or from GitHub.
exec 9> .git/deploy.lock
if ! flock -n 9; then
  echo "Another deployment is running." >&2
  exit 1
fi

if [ ! -f .env.production ]; then
  echo "Missing .env.production: copy .env.production.example and fill it in." >&2
  exit 1
fi
if [ -n "$(find .env.production -perm /077)" ]; then
  echo "Restricting .env.production to its owner (it holds the secrets)."
  chmod 600 .env.production
fi

# Value of a variable of .env.production, as docker compose reads it.
env_value() {
  sed -n "s/^$1=//p" .env.production | tail -n 1 | sed -e 's/\r$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

echo "==> Configuration"
if grep -nE '^[A-Za-z_][A-Za-z0-9_]*=[[:space:]]*<[^>]*>[[:space:]]*$' .env.production; then
  echo "Replace (or empty) the <…> placeholders of .env.production listed above." >&2
  exit 1
fi
if grep -nE '^[^#]*\.example([^A-Za-z0-9-]|$)' .env.production; then
  echo "Replace the example domains and addresses of .env.production listed above." >&2
  exit 1
fi
# Passwords go into connection URLs: letters and digits only (openssl rand -hex 32).
for name in POSTGRES_PASSWORD KEYCLOAK_DB_PASSWORD API_DB_PASSWORD KEYCLOAK_ADMIN_PASSWORD BACKUP_PASSPHRASE; do
  if ! [[ "$(env_value "$name")" =~ ^[A-Za-z0-9]{16,}$ ]]; then
    echo "$name: 16 letters and digits at least, nothing else (e.g. openssl rand -hex 32)." >&2
    exit 1
  fi
done
for name in POSTGRES_USER POSTGRES_DB; do
  if ! [[ "$(env_value "$name")" =~ ^[a-z_][a-z0-9_]*$ ]]; then
    echo "$name: lower-case letters, digits and _ only." >&2
    exit 1
  fi
done

echo "==> Version"
git fetch --prune --tags --quiet origin
# Without an argument: the current branch, or main after a deployment of a
# tag or a commit (detached HEAD).
target="${1:-$(git symbolic-ref --quiet --short HEAD || echo main)}"
if ! [[ "$target" =~ ^[A-Za-z0-9._/][A-Za-z0-9._/-]{0,99}$ ]]; then
  echo "Invalid version: '$target'" >&2
  exit 1
fi
# A branch is taken as it is on GitHub; a tag or a commit as it is.
revision="$target"
if git show-ref --verify --quiet "refs/remotes/origin/$target"; then
  revision="refs/remotes/origin/$target"
fi
if ! sha="$(git rev-parse --verify --quiet --end-of-options "$revision^{commit}")"; then
  echo "Unknown version: '$target'" >&2
  exit 1
fi
git checkout --quiet --detach "$sha"
echo "$target: $(git log -1 --format='%h %s (%cd)' --date=short)"

# A running stack is backed up before the update: its backup service must run.
running="$("${COMPOSE[@]}" ps --status running --services 2> /dev/null || true)"
if [ -n "$running" ] && ! grep -qx backup <<< "$running"; then
  echo "The stack runs without its backup service: start it (${COMPOSE[*]} up -d backup) and check its logs first." >&2
  exit 1
fi

echo "==> Images, with the latest base images (security fixes)"
"${COMPOSE[@]}" pull --ignore-buildable --quiet
if ! output="$("${COMPOSE[@]}" run --rm --no-deps -T proxy \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1)"; then
  echo "$output" >&2
  echo "Invalid proxy configuration (infrastructure/caddy/Caddyfile): nothing was changed." >&2
  exit 1
fi
"${COMPOSE[@]}" build --pull

if [ -n "$running" ]; then
  echo "==> Backup before the update (migrations only go forward)"
  "${COMPOSE[@]}" exec -T backup backup.sh
fi

sync_roles() {
  "${COMPOSE[@]}" exec -T postgres sh /docker-entrypoint-initdb.d/01-roles.sh
}

echo "==> Database roles (passwords of .env.production)"
"${COMPOSE[@]}" up -d --wait --wait-timeout 180 postgres
sync_roles

echo "==> Start"
"${COMPOSE[@]}" up -d --remove-orphans
# Again, for the tables the migrations have just created.
sync_roles
reloaded=false
for _ in $(seq 1 15); do
  if "${COMPOSE[@]}" exec -T proxy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile > /dev/null 2>&1; then
    reloaded=true
    break
  fi
  sleep 2
done
if [ "$reloaded" != true ]; then
  echo "The proxy did not reload its configuration: ${COMPOSE[*]} logs --tail 100 proxy" >&2
  exit 1
fi

echo "==> Waiting for the API and Keycloak"
health() {
  "${COMPOSE[@]}" ps --format '{{.Service}} {{.Health}}' | awk -v service="$1" '$1 == service { print $2 }'
}
for _ in $(seq 1 60); do
  if [ "$(health api)" = healthy ] && [ "$(health keycloak)" = healthy ]; then
    break
  fi
  sleep 5
done
"${COMPOSE[@]}" ps
if [ "$(health api)" != healthy ] || [ "$(health keycloak)" != healthy ]; then
  echo "Not healthy after 5 minutes: ${COMPOSE[*]} logs --tail 100 api keycloak" >&2
  exit 1
fi

# Keycloak answers 503 for a few seconds after its start (bootstrap): wait
# until it serves the realm, from inside the network.
realm=false
for _ in $(seq 1 30); do
  if "${COMPOSE[@]}" exec -T proxy wget -q -O /dev/null \
    http://keycloak:8080/realms/workhoraire/.well-known/openid-configuration 2> /dev/null; then
    realm=true
    break
  fi
  sleep 2
done
if [ "$realm" != true ]; then
  echo "Keycloak does not serve the workhoraire realm: ${COMPOSE[*]} logs --tail 100 keycloak" >&2
  exit 1
fi

echo "==> Public addresses, through the proxy (certificates included)"
https_port="$(env_value HTTPS_PORT)"
https_port="${https_port:-443}"
body="$(mktemp)"
trap 'rm -f "$body"' EXIT
# host, path, expected HTTP status, text expected in the answer (optional)
check() {
  local url="https://$1$2" code=""
  if [ "$https_port" != 443 ]; then
    url="https://$1:$https_port$2"
  fi
  for _ in $(seq 1 24); do
    code="$(curl -s -o "$body" -w '%{http_code}' --max-time 10 \
      --resolve "$1:$https_port:127.0.0.1" "$url" || true)"
    if [ "$code" = "$3" ] && { [ -z "${4:-}" ] || grep -qF -- "$4" "$body"; }; then
      echo "  $url: $code"
      return 0
    fi
    sleep 5
  done
  echo "  $url: $code instead of $3 (DNS record, certificate or service; ${COMPOSE[*]} logs --tail 100 proxy)" >&2
  return 1
}
site_host="$(env_value SITE_HOST)"
auth_host="$(env_value AUTH_HOST)"
failed=false
check "$site_host" / 200 || failed=true
check "$(env_value APP_HOST)" / 200 || failed=true
check "$(env_value API_HOST)" /health 200 '"status":"ok"' || failed=true
check "$auth_host" /realms/workhoraire/.well-known/openid-configuration 200 \
  "\"issuer\":\"https://$auth_host/realms/workhoraire\"" || failed=true
# The administration console stays closed to the public.
check "$auth_host" /admin/ 404 || failed=true
if [ "$failed" = true ]; then
  exit 1
fi

docker image prune -f > /dev/null
echo "Deployed."
