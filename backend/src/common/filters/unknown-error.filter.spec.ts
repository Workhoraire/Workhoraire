import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { UnknownErrorFilter, isExposedClientError } from './unknown-error.filter';

describe('UnknownErrorFilter', () => {
  function run(exception: unknown): { status: number; body: unknown } {
    const sent: { status: number; body: unknown } = { status: 0, body: null };
    const httpAdapter = {
      isHeadersSent: () => false,
      reply: (_response: unknown, body: unknown, status: number) => {
        sent.status = status;
        sent.body = body;
      },
      end: () => undefined,
    };
    const filter = new UnknownErrorFilter(httpAdapter as never);
    const host = {
      getArgByIndex: () => ({}),
      getArgs: () => [{}, {}],
      getType: () => 'http',
      switchToHttp: () => ({ getRequest: () => ({}), getResponse: () => ({}) }),
    } as unknown as ArgumentsHost;
    filter.catch(exception, host);
    return sent;
  }

  it('never forwards the status and message of a library error, e.g. Stripe', () => {
    const stripeError = Object.assign(new Error('Invalid API Key provided: sk_test_***'), {
      statusCode: 401,
      type: 'StripeAuthenticationError',
    });

    const sent = run(stripeError);

    expect(sent.status).toBe(500);
    expect(JSON.stringify(sent.body)).not.toContain('API Key');
  });

  it('keeps HTTP exceptions and exposed client errors of the body parser', () => {
    expect(run(new BadRequestException('Invalid Stripe webhook')).status).toBe(400);
    expect(run(Object.assign(new Error('request entity too large'), { statusCode: 413, expose: true })).status).toBe(413);
  });

  it('only trusts `expose` for client errors', () => {
    expect(isExposedClientError({ statusCode: 413, expose: true })).toBe(true);
    expect(isExposedClientError({ statusCode: 503, expose: true })).toBe(false);
    expect(isExposedClientError({ statusCode: 401 })).toBe(false);
    expect(isExposedClientError(null)).toBe(false);
  });
});
