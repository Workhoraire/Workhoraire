import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import type Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

export type SiteAuthState = 'unknown' | 'anonymous' | 'authenticated';

/**
 * Reads the existing Keycloak SSO session without loading application data.
 * The public site remains anonymously prerendered and only resolves this state
 * in the browser.
 */
@Injectable({ providedIn: 'root' })
export class SiteAuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly state = signal<SiteAuthState>(
    isPlatformBrowser(this.platformId) ? 'unknown' : 'anonymous',
  );
  private keycloak?: Keycloak;
  private initialization?: Promise<void>;

  readonly status = this.state.asReadonly();

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialization ??= this.initialize();
    return this.initialization;
  }

  async logout(): Promise<void> {
    if (!this.keycloak) {
      return;
    }

    await this.keycloak.logout({ redirectUri: this.redirectUri() });
  }

  private async initialize(): Promise<void> {
    try {
      const { default: Keycloak } = await import('keycloak-js');
      const keycloak = new Keycloak(environment.keycloak);
      this.keycloak = keycloak;

      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        redirectUri: this.redirectUri(),
      });

      this.state.set(authenticated ? 'authenticated' : 'anonymous');
      keycloak.onAuthLogout = () => this.state.set('anonymous');
    } catch {
      // An unavailable identity provider must not prevent reading public pages.
      this.state.set('anonymous');
    }
  }

  private redirectUri(): string {
    return `${window.location.origin}${window.location.pathname}${window.location.search}`;
  }
}
