import { environment } from '../../../environments/environment';

interface RuntimeConfig {
  apiUrl?: string;
  siteUrl?: string;
  keycloak?: Partial<typeof environment.keycloak>;
}

/**
 * Applies `/config.json` when the server provides one, before the application
 * starts: the same build then runs in pre-production and production, each
 * container writing this file from its own variables. Without it (`ng serve`),
 * the defaults of `environment.ts` stay.
 */
export async function applyRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok || !response.headers.get('content-type')?.includes('json')) {
      return;
    }
    const config = (await response.json()) as RuntimeConfig;
    if (config.apiUrl) {
      environment.apiUrl = config.apiUrl;
    }
    if (config.siteUrl) {
      environment.siteUrl = config.siteUrl;
    }
    Object.assign(environment.keycloak, config.keycloak ?? {});
  } catch {
    // No runtime configuration: keep the defaults.
  }
}
