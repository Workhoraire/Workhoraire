# Application image: the Angular build, served by Caddy. The same image runs
# in every environment: `/config.json` (API and Keycloak URLs) is written at
# start-up from the container variables, see docker/entrypoint.sh.
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY public ./public
COPY src ./src
RUN npx ng build --configuration production

FROM caddy:2-alpine
COPY --from=build /app/dist/frontend/browser /srv
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
