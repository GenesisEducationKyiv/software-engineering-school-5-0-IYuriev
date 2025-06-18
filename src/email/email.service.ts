import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Email } from '../constants/enums/email';
import {
  EmailTransport,
  EmailTransportToken,
} from './interfaces/email-transport.interface';
import { EmailPayload } from '../constants/types/email';
import { EmailProvider } from './interfaces/email-service.interface';

@Injectable()
export class EmailService implements EmailProvider {
  private confirmationUrl: string;
  constructor(
    @Inject(EmailTransportToken)
    private readonly emailTransport: EmailTransport,
    private readonly config: ConfigService,
  ) {
    this.confirmationUrl = this.config.get<string>('CONFIRMATION_URL') ?? '';
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const link = `${this.confirmationUrl}/${token}`;
    await this.emailTransport.sendMail({
      from: this.config.get<string>('EMAIL_USER') ?? '',
      to: email,
      subject: Email.SUBJECT,
      text: `${Email.TEXT}${link}`,
    });
  }

  async sendForecastEmail(payload: EmailPayload): Promise<void> {
    await this.emailTransport.sendMail({
      from: this.config.get<string>('EMAIL_USER') ?? '',
      ...payload,
    });
  }
}
