import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ApplicationUserGuard } from './application-user.guard';
import { AuthService } from './auth.service';
import { KeycloakRequest } from './auth.types';

describe('ApplicationUserGuard', () => {
  function contextFor(request: KeycloakRequest): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
  }

  it('attaches the application user resolved from the Keycloak subject', async () => {
    const applicationUser = {
      id: 'user-1',
      keycloakSubject: 'subject-1',
      companyId: 'company-a',
      isActive: true,
    };
    const authService = {
      findByKeycloakSubject: jest.fn().mockResolvedValue(applicationUser),
    } as unknown as AuthService;
    const guard = new ApplicationUserGuard(authService);
    const request = { user: { sub: 'subject-1' } } as KeycloakRequest;

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);

    expect(authService.findByKeycloakSubject).toHaveBeenCalledWith('subject-1');
    expect(request.applicationUser).toBe(applicationUser);
  });

  it('blocks an inactive application user', async () => {
    const authService = {
      findByKeycloakSubject: jest.fn().mockResolvedValue({
        id: 'user-1',
        keycloakSubject: 'subject-1',
        companyId: 'company-a',
        isActive: false,
      }),
    } as unknown as AuthService;
    const guard = new ApplicationUserGuard(authService);
    const request = { user: { sub: 'subject-1' } } as KeycloakRequest;

    await expect(guard.canActivate(contextFor(request))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
  it('keeps the e-mail of the verified sign-in account, and only a verified one', async () => {
    const stored = () => ({
      id: 'user-1',
      keycloakSubject: 'subject-1',
      companyId: 'company-a',
      email: 'old@example.com',
      isActive: true,
    });
    const authService = {
      findByKeycloakSubject: jest.fn().mockImplementation(async () => stored()),
      updateEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as AuthService;
    const guard = new ApplicationUserGuard(authService);

    const unverified = {
      user: { sub: 'subject-1', email: 'attacker@example.com', email_verified: false },
    } as KeycloakRequest;
    await guard.canActivate(contextFor(unverified));
    expect(authService.updateEmail).not.toHaveBeenCalled();
    expect(unverified.applicationUser?.email).toBe('old@example.com');

    const verified = {
      user: { sub: 'subject-1', email: ' New@Example.com ', email_verified: true },
    } as KeycloakRequest;
    await guard.canActivate(contextFor(verified));
    expect(authService.updateEmail).toHaveBeenCalledWith('user-1', 'new@example.com');
    expect(verified.applicationUser?.email).toBe('new@example.com');
  });
});
