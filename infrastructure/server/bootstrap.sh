#!/usr/bin/env bash
# Prepares a fresh Ubuntu 24.04 or Debian 12 server for WorkHoraire, as root
# (or with sudo): system updates and automatic security updates (Docker's
# included, never an automatic reboot), SSH by key only, firewall, fail2ban,
# Docker Engine with the Compose plugin, logs kept 6 months at most in the
# system journal, a swap file, and a read-only deploy key for GitHub.
# It can be run again: it only changes what differs, and Docker restarts only
# when its settings change. See docs/technique/exploitation.md.
#
#   scp infrastructure/server/bootstrap.sh ubuntu@SERVER:
#   ssh -t ubuntu@SERVER sudo bash bootstrap.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/workhoraire}"
SWAP_SIZE="${SWAP_SIZE:-2G}"
# GitHub's published Ed25519 host key fingerprint, checked before trusting it.
GITHUB_ED25519="SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU"
# A fresh server often runs its first automatic updates: wait for them.
APT=(apt-get -q -o DPkg::Lock::Timeout=600)

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root, or with sudo." >&2
  exit 1
fi
. /etc/os-release
case "$ID" in
  ubuntu | debian) ;;
  *) echo "Ubuntu or Debian only (found $ID)." >&2; exit 1 ;;
esac

# The account that runs the application: the one that called sudo (ubuntu on
# an OVHcloud VPS), or a new "deploy" account when logged in as root.
DEPLOY_USER="${DEPLOY_USER:-${SUDO_USER:-deploy}}"
if [ "$DEPLOY_USER" = root ]; then
  DEPLOY_USER=deploy
fi

export DEBIAN_FRONTEND=noninteractive

# Writes a file only when its content changes; true when it did.
write_if_changed() {
  if [ -f "$1" ] && [ "$(cat "$1")" = "$2" ]; then
    return 1
  fi
  install -d "$(dirname "$1")"
  printf '%s\n' "$2" > "$1"
}

echo "==> System updates"
"${APT[@]}" update
"${APT[@]}" -y upgrade
"${APT[@]}" -y install ca-certificates curl git ufw fail2ban python3-systemd unattended-upgrades

echo "==> Automatic security updates, Docker's included, without automatic reboot"
write_if_changed /etc/apt/apt.conf.d/20auto-upgrades 'APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";' || true
# Docker Engine updates restart the daemon only: containers keep running
# (live-restore below). No automatic reboot: employees clock in early in the
# morning; reboot by hand once a month (docs/technique/exploitation.md).
write_if_changed /etc/apt/apt.conf.d/52workhoraire-unattended-upgrades '// WorkHoraire (infrastructure/server/bootstrap.sh)
Unattended-Upgrade::Origins-Pattern { "origin=Docker"; };
Unattended-Upgrade::Automatic-Reboot "false";' || true

echo "==> Account $DEPLOY_USER, reachable by SSH key only"
new_account=false
if ! id "$DEPLOY_USER" > /dev/null 2>&1; then
  new_account=true
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  # No password to type: administration goes through this account.
  echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/90-$DEPLOY_USER"
  chmod 440 "/etc/sudoers.d/90-$DEPLOY_USER"
fi
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
AUTH_KEYS="$DEPLOY_HOME/.ssh/authorized_keys"
# A key line without options. Options restrict a key: cloud-init prefixes
# root's copy of the administrator's key with a command that refuses the login,
# and the GitHub Actions key may only deploy.
KEY_LINE='^(ssh-(ed25519|rsa)|ecdsa-sha2-nistp(256|384|521)|sk-(ssh-ed25519|ecdsa-sha2-nistp256)@openssh\.com) '
if [ "$new_account" = true ]; then
  # The keys installed by the host at delivery, without options, in order, once.
  for source in /root/.ssh/authorized_keys /home/ubuntu/.ssh/authorized_keys /home/debian/.ssh/authorized_keys; do
    if [ -s "$source" ]; then
      grep -E "$KEY_LINE" "$source" || true
    fi
  done | awk '!seen[$0]++' > "$AUTH_KEYS"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$AUTH_KEYS"
  chmod 600 "$AUTH_KEYS"
fi
# An existing account's keys are never changed, only checked.
if ! grep -qE "$KEY_LINE" "$AUTH_KEYS" 2> /dev/null; then
  echo "No SSH key without options in $AUTH_KEYS: add yours before passwords are turned off." >&2
  exit 1
fi

echo "==> SSH: keys only, no root login"
# sshd keeps the first value it reads: this file comes before the host's own settings.
write_if_changed /etc/ssh/sshd_config.d/10-workhoraire.conf 'PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes' || true
sshd -t
# Open sessions stay connected; Ubuntu 24.04 may start sshd through its socket.
systemctl reload ssh 2> /dev/null || systemctl restart ssh

echo "==> Firewall: SSH, HTTP and HTTPS only"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> fail2ban on SSH"
if write_if_changed /etc/fail2ban/jail.d/sshd.local '[sshd]
enabled = true
backend = systemd'; then
  systemctl restart fail2ban
fi
systemctl enable --now fail2ban

echo "==> System journal: 6 months at most (privacy policy), 1 GB at most"
# Container logs go there too (Docker's journald driver below). One file a
# day, so that nothing older than 6 months survives more than a day.
if write_if_changed /etc/systemd/journald.conf.d/90-workhoraire.conf '[Journal]
Storage=persistent
SystemMaxUse=1G
MaxRetentionSec=6month
MaxFileSec=1day'; then
  systemctl restart systemd-journald
fi

echo "==> Docker Engine and Compose (official repository)"
if ! command -v docker > /dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID ${UBUNTU_CODENAME:-$VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  "${APT[@]}" update
  "${APT[@]}" -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
# Container logs in the system journal (`docker compose logs` still works),
# and containers that keep running while the Docker daemon is updated.
if write_if_changed /etc/docker/daemon.json '{
  "log-driver": "journald",
  "log-opts": { "tag": "{{.Name}}" },
  "live-restore": true
}'; then
  systemctl restart docker
fi
usermod -aG docker "$DEPLOY_USER"

echo "==> Swap file ($SWAP_SIZE)"
if ! swapon --show | grep -q .; then
  fallocate -l "$SWAP_SIZE" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile > /dev/null
  swapon /swapfile
  grep -q "^/swapfile " /etc/fstab || echo "/swapfile none swap sw 0 0" >> /etc/fstab
  echo "vm.swappiness=10" > /etc/sysctl.d/90-swappiness.conf
  sysctl -q -p /etc/sysctl.d/90-swappiness.conf
fi

echo "==> Read-only deploy key for GitHub"
KEY="$DEPLOY_HOME/.ssh/github_workhoraire"
if [ ! -f "$KEY" ]; then
  sudo -u "$DEPLOY_USER" ssh-keygen -q -t ed25519 -N "" -C "workhoraire-server" -f "$KEY"
fi
KNOWN_HOSTS="$DEPLOY_HOME/.ssh/known_hosts"
if ! grep -q "^github.com ssh-ed25519" "$KNOWN_HOSTS" 2> /dev/null; then
  host_key="$(ssh-keyscan -t ed25519 github.com 2> /dev/null)"
  if [ "$(echo "$host_key" | ssh-keygen -lf - | awk '{print $2}')" != "$GITHUB_ED25519" ]; then
    echo "GitHub's host key does not match its published fingerprint: stopping." >&2
    exit 1
  fi
  echo "$host_key" >> "$KNOWN_HOSTS"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$KNOWN_HOSTS"
fi
# Added once to the account's SSH settings, which are otherwise left alone.
SSH_CONFIG="$DEPLOY_HOME/.ssh/config"
if ! grep -qx "Host github.com" "$SSH_CONFIG" 2> /dev/null; then
  printf 'Host github.com\n  IdentityFile %s\n  IdentitiesOnly yes\n' "$KEY" >> "$SSH_CONFIG"
fi
chown "$DEPLOY_USER:$DEPLOY_USER" "$SSH_CONFIG"
chmod 600 "$SSH_CONFIG"

install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$APP_DIR"

cat <<EOF

Server ready. Before closing this session, check from another terminal that
you can still log in: ssh $DEPLOY_USER@<server address>

Next steps (docs/technique/exploitation.md):
1. GitHub > Workhoraire/Workhoraire > Settings > Deploy keys > Add deploy key,
   read-only, with this public key:

$(cat "$KEY.pub")

2. As $DEPLOY_USER (log in again for the docker group):
   git clone git@github.com:Workhoraire/Workhoraire.git $APP_DIR
EOF
if [ -f /var/run/reboot-required ]; then
  echo
  echo "The updates ask for a reboot: sudo reboot (the server is back within a minute)."
fi
