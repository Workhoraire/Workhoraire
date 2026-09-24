import { CallHandler, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import { BillingService } from './billing.service';
import { ReadOnlyInterceptor } from './read-only.interceptor';

describe('ReadOnlyInterceptor', () => {
  const handler = (): void => undefined;
  class Controller {}

  function setup(options: { readOnly: boolean; paymentsEnabled?: boolean; allowed?: boolean }) {
    const billing = {
      paymentsEnabled: options.paymentsEnabled ?? true,
      isReadOnly: jest.fn().mockResolvedValue(options.readOnly),
    } as unknown as BillingService;
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(options.allowed ?? false),
    } as unknown as Reflector;
    const next: CallHandler = { handle: jest.fn(() => of('done')) };
    const run = (method: string, companyId: string | null = 'company-1') => {
      const context = {
        getType: () => 'http',
        getHandler: () => handler,
        getClass: () => Controller,
        switchToHttp: () => ({
          getRequest: () => ({ method, applicationUser: companyId ? { companyId } : undefined }),
        }),
      } as unknown as ExecutionContext;
      return lastValueFrom(new ReadOnlyInterceptor(reflector, billing).intercept(context, next));
    };
    return { billing, next, run };
  }

  it('refuses changes of a read-only company with 402', async () => {
    const { run, next } = setup({ readOnly: true });

    await expect(run('POST')).rejects.toBeInstanceOf(HttpException);
    await expect(run('PATCH')).rejects.toMatchObject({ status: 402 });
    expect(next.handle).not.toHaveBeenCalled();
  });

  it('keeps reading, clocking and paying open', async () => {
    const readOnly = setup({ readOnly: true });
    await expect(readOnly.run('GET')).resolves.toBe('done');

    const allowed = setup({ readOnly: true, allowed: true });
    await expect(allowed.run('POST')).resolves.toBe('done');
    expect(allowed.billing.isReadOnly).not.toHaveBeenCalled();
  });

  it('lets changes through when paid, without payments, or before the account exists', async () => {
    await expect(setup({ readOnly: false }).run('POST')).resolves.toBe('done');

    const disabled = setup({ readOnly: true, paymentsEnabled: false });
    await expect(disabled.run('POST')).resolves.toBe('done');
    expect(disabled.billing.isReadOnly).not.toHaveBeenCalled();

    // Onboarding and invitation acceptance: no application user yet.
    await expect(setup({ readOnly: true }).run('POST', null)).resolves.toBe('done');
  });
});
