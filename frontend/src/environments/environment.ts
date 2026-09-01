export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'workhoraire',
    clientId: 'workhoraire-web',
  },
} as const;
