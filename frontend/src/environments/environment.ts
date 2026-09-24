/**
 * Defaults used by `ng serve`. In a container, `/config.json` (written at
 * start-up from the container variables) overrides them: see
 * `core/config/runtime-config.ts`.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  /** Marketing site: terms of sale, privacy policy and processing agreement. */
  siteUrl: 'http://localhost:4400',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'workhoraire',
    clientId: 'workhoraire-web',
  },
};
