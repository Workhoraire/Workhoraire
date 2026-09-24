# Encrypted database dumps (WorkHoraire and Keycloak schemas), copied off the
# server with rclone, and restore test.
FROM postgres:16-alpine
RUN apk add --no-cache openssl rclone
COPY backup.sh restore.sh restore-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh /usr/local/bin/restore-check.sh
CMD ["/usr/local/bin/backup.sh", "--daemon"]
