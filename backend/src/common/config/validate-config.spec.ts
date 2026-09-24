import { validateConfig } from './validate-config';

const production = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://api@postgres:5432/workhoraire',
  FRONTEND_URL: 'https://app.workhoraire.example',
  KEYCLOAK_AUTH_SERVER_URL: 'https://auth.workhoraire.example',
  KEYCLOAK_REALM: 'workhoraire',
  KEYCLOAK_CLIENT_ID: 'workhoraire-api',
};

describe('validateConfig', () => {
  it('accepts a complete production configuration and keeps every setting', () => {
    expect(validateConfig({ ...production, STRIPE_PRICE_ID: 'price_1' })).toEqual({
      ...production,
      STRIPE_PRICE_ID: 'price_1',
    });
  });

  it('refuses to start in production without a required setting', () => {
    expect(() => validateConfig({ ...production, KEYCLOAK_REALM: '', DATABASE_URL: undefined })).toThrow(
      'Invalid configuration: DATABASE_URL is required in production; KEYCLOAK_REALM is required in production',
    );
    expect(() => validateConfig({ ...production, SMTP_HOST: 'smtp-relay.example' })).toThrow(
      'MAIL_FROM is required when SMTP_HOST is set',
    );
  });

  it('only requires those settings in production', () => {
    expect(validateConfig({ NODE_ENV: 'test', SMTP_HOST: 'localhost' })).toEqual({
      NODE_ENV: 'test',
      SMTP_HOST: 'localhost',
    });
  });

  it('normalises the application address and the rate limit', () => {
    expect(
      validateConfig({ FRONTEND_URL: ' http://localhost:4200/ ', THROTTLE_LIMIT_PER_MINUTE: '120' }),
    ).toEqual({ FRONTEND_URL: 'http://localhost:4200', THROTTLE_LIMIT_PER_MINUTE: 120 });
  });

  it('refuses an address with a path and a rate limit that is not a positive integer', () => {
    expect(() => validateConfig({ FRONTEND_URL: 'https://app.example/app' })).toThrow('FRONTEND_URL');
    for (const limit of ['0', '-5', '300/min', '1.5']) {
      expect(() => validateConfig({ THROTTLE_LIMIT_PER_MINUTE: limit })).toThrow(
        'THROTTLE_LIMIT_PER_MINUTE must be a positive integer',
      );
    }
  });
});
