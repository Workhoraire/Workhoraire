import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keycloak = require('keycloak-connect');
import { KeycloakUser } from './auth.types';

/**
 * Validates the access tokens issued by Keycloak, with the grant manager of
 * keycloak-connect: signature (realm keys), issuer, audience and expiry. Its
 * Express middleware is not mounted: a bearer-only API needs none of its
 * login, logout or admin callback routes.
 */
@Injectable()
export class KeycloakService {
  private readonly adapter: Keycloak.Keycloak;

  constructor(configService: ConfigService) {
    const config = {
      realm: configService.get<string>('KEYCLOAK_REALM', 'workhoraire'),
      'auth-server-url':
        configService.get<string>(
          'KEYCLOAK_AUTH_SERVER_URL',
          'http://localhost:8180',
        ),
      resource: configService.get<string>('KEYCLOAK_CLIENT_ID', 'workhoraire-api'),
      'bearer-only': true,
      'verify-token-audience': true,
    };

    // The typing of keycloak-connect requires redirect settings that token checks never read.
    this.adapter = new Keycloak({}, config as unknown as Keycloak.KeycloakConfig);
  }

  /** The claims of a valid access token, or null for a missing, forged, foreign or expired one. */
  async verifyAccessToken(accessToken: string): Promise<KeycloakUser | null> {
    try {
      const grant = await this.adapter.grantManager.createGrant(
        JSON.stringify({ access_token: accessToken }),
      );
      const token = grant.access_token as unknown as { content?: KeycloakUser } | undefined;
      return token?.content?.sub ? token.content : null;
    } catch {
      return null;
    }
  }
}
