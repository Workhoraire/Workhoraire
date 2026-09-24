import { isDevMode } from '@angular/core';

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
 * the defaults of `environment.ts` stay. A production build refuses to start
 * without it rather than calling localhost.
 */
export async function applyRuntimeConfig(): Promise<void> {
  let config: RuntimeConfig | null = null;
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (response.ok && response.headers.get('content-type')?.includes('json')) {
      config = (await response.json()) as RuntimeConfig;
    }
  } catch {
    // Handled below.
  }
  if (!config) {
    if (isDevMode()) {
      return;
    }
    throw new Error('Missing or invalid /config.json');
  }
  if (config.apiUrl) {
    environment.apiUrl = config.apiUrl;
  }
  if (config.siteUrl) {
    environment.siteUrl = config.siteUrl;
  }
  Object.assign(environment.keycloak, config.keycloak ?? {});
}
