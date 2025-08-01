import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider } from '../../domain/email-service.interface';
import {
  EmailTransport,
  EmailTransportToken,
} from '../interfaces/email-transport.interface';
import { Email } from '../../../../../libs/constants/enums/email';
import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../../libs/constants/types/email';

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

  async sendConfirmationEmail(
    payload: EmailConfirmationPayload,
  ): Promise<void> {
    const link = `${this.confirmationUrl}/${payload.token}`;
    await this.emailTransport.sendMail({
      from: this.config.get<string>('EMAIL_USER') ?? '',
      to: payload.email,
      subject: Email.SUBJECT,
      text: `${Email.TEXT}${link}`,
    });
  }

  async sendForecastEmail(payload: EmailForecastPayload): Promise<void> {
    await this.emailTransport.sendMail({
      from: this.config.get<string>('EMAIL_USER') ?? '',
      ...payload,
    });
  }
}
