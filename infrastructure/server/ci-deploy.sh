#!/usr/bin/env bash
# Forced command of the GitHub Actions deploy key: whatever the workflow asks,
# this key can only deploy a commit of main, never open a shell. In the deploy
# account's ~/.ssh/authorized_keys (through bash: works without the executable bit):
#   restrict,command="bash /srv/workhoraire/infrastructure/server/ci-deploy.sh" ssh-ed25519 AAAA… github-actions
# The version comes from the SSH command line (SSH_ORIGINAL_COMMAND): main, a
# v* tag, or a full commit hash (what the workflow sends, once its CI passed);
# in every case, a commit of main's history.
set -euo pipefail

ref="${SSH_ORIGINAL_COMMAND:-}"
if ! [[ "$ref" == main || "$ref" =~ ^v[0-9][A-Za-z0-9._-]{0,50}$ || "$ref" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Only main, a v* tag or a commit of main can be deployed from GitHub, not '$ref'." >&2
  exit 1
fi

cd "$(dirname "$0")/../.."
git fetch --prune --tags --quiet origin
case "$ref" in
  main) revision=refs/remotes/origin/main ;;
  v*) revision="refs/tags/$ref" ;;
  *) revision="$ref" ;;
esac
if ! sha="$(git rev-parse --verify --quiet --end-of-options "$revision^{commit}")" \
  || ! git merge-base --is-ancestor "$sha" refs/remotes/origin/main; then
  echo "'$ref' is not a commit of main: refused." >&2
  exit 1
fi

exec bash infrastructure/server/deploy.sh "$sha"
