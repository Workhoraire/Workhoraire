import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { MailService } from './mail.service';

jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

const content = { subject: 'Sujet', text: 'Texte', html: '<p>Texte</p>' };

function serviceWith(settings: Record<string, string>): MailService {
  return new MailService({
    get: (key: string, fallback?: string) => settings[key] ?? fallback,
  } as unknown as ConfigService);
}

describe('MailService', () => {
  const sendMail = jest.fn();

  beforeEach(() => {
    sendMail.mockReset();
    (createTransport as jest.Mock).mockReset().mockReturnValue({ sendMail });
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('requires TLS on the submission port only', () => {
    serviceWith({ SMTP_HOST: 'smtp-relay.example', SMTP_PORT: '587' });
    serviceWith({ SMTP_HOST: 'localhost', SMTP_PORT: '2525' });
    serviceWith({ SMTP_HOST: 'smtp-relay.example', SMTP_PORT: '465' });

    const options = (createTransport as jest.Mock).mock.calls.map(([option]) => option);
    expect(options[0]).toMatchObject({ port: 587, secure: false, requireTLS: true });
    expect(options[1]).toMatchObject({ port: 2525, secure: false, requireTLS: false });
    expect(options[2]).toMatchObject({ port: 465, secure: true, requireTLS: false });
  });

  it('logs a failure with its code and message, without the addresses', async () => {
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    sendMail.mockRejectedValue(
      Object.assign(
        new Error("Can't send mail - all recipients were rejected: 550 5.1.1 <jane.doe@example.com>: unknown"),
        { code: 'EENVELOPE', responseCode: 550 },
      ),
    );

    await expect(serviceWith({ SMTP_HOST: 'localhost', SMTP_PORT: '2525' }).send('jane.doe@example.com', content))
      .resolves.toBe(false);

    const logged = error.mock.calls[0][0] as string;
    expect(logged).toContain('EENVELOPE 550');
    expect(logged).toContain('all recipients were rejected');
    expect(logged).not.toContain('jane.doe@example.com');
  });

  it('sends nothing without an SMTP server', async () => {
    const service = serviceWith({});

    expect(service.enabled).toBe(false);
    await expect(service.send('jane.doe@example.com', content)).resolves.toBe(false);
    expect(createTransport).not.toHaveBeenCalled();
  });
});
