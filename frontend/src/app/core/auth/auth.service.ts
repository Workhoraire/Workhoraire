import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  private readonly authenticatedState = signal(false);
  readonly authenticated = this.authenticatedState.asReadonly();

  private redirectUri(): string {
    return `${window.location.origin}${window.location.pathname}`;
  }

  async init(): Promise<void> {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: this.redirectUri(),
    });

    this.authenticatedState.set(authenticated);
    this.keycloak.onAuthLogout = () => this.authenticatedState.set(false);
  }

  async login(): Promise<void> {
    await this.keycloak.login({
      redirectUri: this.redirectUri(),
    });
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({
      redirectUri: `${window.location.origin}/`,
    });
  }

  async getToken(): Promise<string | null> {
    if (!this.authenticatedState()) {
      return null;
    }

    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token ?? null;
    } catch {
      this.keycloak.clearToken();
      this.authenticatedState.set(false);
      return null;
    }
  }
}
