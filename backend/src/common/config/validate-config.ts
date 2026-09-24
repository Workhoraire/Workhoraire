/** Settings the API cannot run without in production. */
const REQUIRED_IN_PRODUCTION = [
  'DATABASE_URL',
  'FRONTEND_URL',
  'KEYCLOAK_AUTH_SERVER_URL',
  'KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID',
];

/**
 * Checks the environment at startup (ConfigModule `validate`): the API fails
 * fast instead of running with a broken configuration. Returns the whole
 * configuration, some values normalised: ConfigModule copies it into
 * process.env, which is how the .env file reaches Prisma in development.
 */
export function validateConfig(config: Record<string, unknown>): Record<string, unknown> {
  const setting = (key: string): string => {
    const value = config[key];
    return typeof value === 'string' ? value.trim() : '';
  };
  const errors: string[] = [];
  const validated: Record<string, unknown> = { ...config };

  if (setting('NODE_ENV') === 'production') {
    for (const key of REQUIRED_IN_PRODUCTION) {
      if (!setting(key)) {
        errors.push(`${key} is required in production`);
      }
    }
    if (setting('SMTP_HOST') && !setting('MAIL_FROM')) {
      errors.push('MAIL_FROM is required when SMTP_HOST is set');
    }
  }

  // Compared as is with the Origin header (CORS) and used to build links.
  const frontendUrl = setting('FRONTEND_URL').replace(/\/+$/, '');
  if (frontendUrl) {
    if (!/^https?:\/\/[^/?#]+$/.test(frontendUrl)) {
      errors.push('FRONTEND_URL must be an origin such as https://app.example.com');
    }
    validated['FRONTEND_URL'] = frontendUrl;
  }

  const throttleLimit = setting('THROTTLE_LIMIT_PER_MINUTE');
  if (throttleLimit) {
    if (!/^[1-9]\d*$/.test(throttleLimit)) {
      errors.push('THROTTLE_LIMIT_PER_MINUTE must be a positive integer');
    }
    validated['THROTTLE_LIMIT_PER_MINUTE'] = Number(throttleLimit);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid configuration: ${errors.join('; ')}`);
  }
  return validated;
}
