import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestHandler } from 'express';
import Keycloak = require('keycloak-connect');

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
      'ssl-required': configService.get<string>('KEYCLOAK_SSL_REQUIRED', 'none'),
      resource: configService.get<string>('KEYCLOAK_CLIENT_ID', 'workhoraire-api'),
      'bearer-only': true,
      'verify-token-audience': true,
      'confidential-port': 0,
    } as Keycloak.KeycloakConfig;

    this.adapter = new Keycloak({}, config);
  }

  getMiddleware(): RequestHandler[] {
    return this.adapter.middleware();
  }
}
