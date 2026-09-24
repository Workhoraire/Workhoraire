# Encrypted database dumps (WorkHoraire and Keycloak schemas) and restore test.
FROM postgres:18-alpine
RUN apk add --no-cache openssl
COPY backup.sh restore-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore-check.sh
CMD ["/usr/local/bin/backup.sh", "--daemon"]
