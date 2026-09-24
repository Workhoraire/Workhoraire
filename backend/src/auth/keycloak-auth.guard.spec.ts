import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakRequest } from './auth.types';
import { KeycloakAuthGuard } from './keycloak-auth.guard';
import { KeycloakService } from './keycloak.service';

function contextFor(request: Partial<KeycloakRequest>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('KeycloakAuthGuard', () => {
  it('exposes the claims of a valid bearer token', async () => {
    const keycloak = {
      verifyAccessToken: jest.fn().mockResolvedValue({ sub: 'subject-1', email: 'a@example.com' }),
    } as unknown as KeycloakService;
    const request = { headers: { authorization: 'Bearer abc.def.ghi' } } as Partial<KeycloakRequest>;

    await expect(new KeycloakAuthGuard(keycloak).canActivate(contextFor(request))).resolves.toBe(true);
    expect(keycloak.verifyAccessToken).toHaveBeenCalledWith('abc.def.ghi');
    expect(request.user).toEqual({ sub: 'subject-1', email: 'a@example.com' });
  });

  it('refuses a missing, malformed or rejected token with 401', async () => {
    const keycloak = { verifyAccessToken: jest.fn().mockResolvedValue(null) } as unknown as KeycloakService;
    const guard = new KeycloakAuthGuard(keycloak);

    for (const authorization of [undefined, 'Basic dXNlcjpwYXNz', 'Bearer', 'Bearer forged.token']) {
      await expect(
        guard.canActivate(contextFor({ headers: { authorization } } as Partial<KeycloakRequest>)),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    }
    expect(keycloak.verifyAccessToken).toHaveBeenCalledTimes(1);
  });

  it('really rejects a token that is not a Keycloak token, without calling Keycloak', async () => {
    const keycloak = new KeycloakService({
      get: (_key: string, fallback: string) => fallback,
    } as unknown as ConfigService);

    await expect(keycloak.verifyAccessToken('not-a-jwt')).resolves.toBeNull();
    // Well formed but unsigned, expired and from another issuer.
    const header = Buffer.from(JSON.stringify({ alg: 'none', kid: 'x' })).toString('base64url');
    const claims = Buffer.from(JSON.stringify({ sub: 'intruder', typ: 'Bearer', exp: 1 })).toString('base64url');
    await expect(keycloak.verifyAccessToken(`${header}.${claims}.`)).resolves.toBeNull();
  });
});
