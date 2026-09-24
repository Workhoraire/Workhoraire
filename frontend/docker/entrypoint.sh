#!/bin/sh
# Writes the runtime configuration of the application from the container
# variables, then starts the web server.
set -eu

: "${API_URL:?API_URL must be set, e.g. https://api.example.com}"
: "${KEYCLOAK_URL:?KEYCLOAK_URL must be set, e.g. https://auth.example.com}"
: "${SITE_URL:?SITE_URL must be set, e.g. https://example.com}"

cat > /srv/config.json <<EOF
{
  "apiUrl": "${API_URL}",
  "siteUrl": "${SITE_URL}",
  "keycloak": {
    "url": "${KEYCLOAK_URL}",
    "realm": "${KEYCLOAK_REALM:-workhoraire}",
    "clientId": "${KEYCLOAK_CLIENT_ID:-workhoraire-web}"
  }
}
EOF

exec "$@"
