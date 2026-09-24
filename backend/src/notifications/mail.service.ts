import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { MailContent } from './mail-templates';

/**
 * Sends the transactional e-mails through SMTP (Brevo or any provider in
 * production, Mailpit in development). Without SMTP_HOST nothing is sent and
 * the application keeps working: the invitation link can still be copied.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    this.from = config.get<string>('MAIL_FROM') || 'WorkHoraire <no-reply@localhost>';
    const host = config.get<string>('SMTP_HOST', '');
    if (!host) {
      this.transport = null;
      this.logger.warn('SMTP_HOST is not set: e-mails are not sent');
      return;
    }

    const port = Number(config.get<string>('SMTP_PORT', '587'));
    const user = config.get<string>('SMTP_USER', '');
    this.transport = createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass: config.get<string>('SMTP_PASSWORD', '') } : undefined,
      // A slow or unreachable server must not hold a request for minutes.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }

  get enabled(): boolean {
    return this.transport !== null;
  }

  /**
   * Never throws: a failed e-mail must not undo the action that triggered it.
   * Returns whether the e-mail was accepted by the SMTP server.
   */
  async send(to: string, content: MailContent): Promise<boolean> {
    if (!this.transport) {
      return false;
    }
    try {
      await this.transport.sendMail({ from: this.from, to, ...content });
      return true;
    } catch (error: unknown) {
      this.logger.error(`E-mail not sent: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
}
