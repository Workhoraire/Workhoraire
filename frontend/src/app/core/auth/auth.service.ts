import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

/**
 * Pages open before any sign-in: an invitation link first shows who invites
 * the person, and the website's sign-up link leads to the sign-up page.
 */
function isPublicPage(): boolean {
  const path = window.location.pathname;
  return path.startsWith('/employee-invitations/') || path === '/inscription';
}

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
      onLoad: isPublicPage() ? 'check-sso' : 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: this.redirectUri(),
    });

    this.authenticatedState.set(authenticated);
    this.keycloak.onAuthLogout = () => this.authenticatedState.set(false);
  }

  /** Keycloak sign-in page, with the address already filled in when it is known. */
  async login(loginHint?: string): Promise<void> {
    await this.keycloak.login({
      redirectUri: this.redirectUri(),
      loginHint,
    });
  }

  /** Keycloak sign-up page: with the address filled in, only the password is left to choose. */
  async register(loginHint?: string): Promise<void> {
    await this.keycloak.register({
      redirectUri: this.redirectUri(),
      loginHint,
    });
  }

  /** Signs out, then returns to the given page (the home page by default). */
  async logout(returnUrl = `${window.location.origin}/`): Promise<void> {
    await this.keycloak.logout({
      redirectUri: returnUrl,
    });
  }

  /** E-mail of the signed-in Keycloak account, to tell the person which account is in use. */
  email(): string | null {
    const token = this.keycloak.tokenParsed as { email?: string } | undefined;
    return token?.email ?? null;
  }

  /** Name known by Keycloak, if any: accounts created from an invitation have none. */
  names(): { firstName: string | null; lastName: string | null } {
    const token = this.keycloak.tokenParsed as
      | { given_name?: string; family_name?: string }
      | undefined;
    return { firstName: token?.given_name ?? null, lastName: token?.family_name ?? null };
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
