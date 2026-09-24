# Marketing site: pages pre-rendered at build time, then served as static files.
FROM node:25-slim AS build
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public addresses, fixed in the pre-rendered pages (canonical URLs, sign-up links).
ARG SITE_URL=http://localhost:4400
ARG APP_URL=http://localhost:4200
RUN node scripts/set-urls.mjs "$SITE_URL" "$APP_URL" && npm run build

FROM caddy:2-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /site/dist/site/browser /srv
EXPOSE 80
