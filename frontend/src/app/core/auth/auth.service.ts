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

  /**
   * Back from Keycloak on the same page, query string included: the offer chosen
   * on the website (?offre=) and Stripe's return (?paiement=) survive the round trip.
   * Keycloak answers in the fragment, so the query string holds none of its parameters.
   */
  private redirectUri(): string {
    return `${window.location.origin}${window.location.pathname}${window.location.search}`;
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

  /**
   * Keycloak's account page: password, two-factor authentication, sessions.
   * Its "back" link returns to the current page.
   */
  accountUrl(): string {
    return this.keycloak.createAccountUrl({ redirectUri: window.location.href });
  }

  /** E-mail of the signed-in Keycloak account, to tell the person which account is in use. */
  email(): string | null {
    const token = this.keycloak.tokenParsed as { email?: string } | undefined;
    return token?.email ?? null;
  }

  /** Name known by Keycloak, if any: accounts created from an invitation have none. */
  names(): { firstName: string | null; lastName: string | null } {
    const token = this.keycloak.tokenParsed as
      { given_name?: string; family_name?: string } | undefined;
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
      // keycloak-js drops the tokens itself when the session is over (HTTP 400).
      // Offline or timed out, the session stays: the request fails and says so.
      if (!this.keycloak.refreshToken) {
        this.authenticatedState.set(false);
        return null;
      }
      return this.keycloak.token ?? null;
    }
  }
}
