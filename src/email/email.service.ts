import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Email } from '../constants/enums/email';
import {
  IEmailTransport,
  EmailTransportToken,
} from './interfaces/email-transport.interface';
import { IEmailPayload } from '../constants/types/email.interface';
import { IEmailService } from './interfaces/email-service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private confirmationUrl: string;
  constructor(
    @Inject(EmailTransportToken)
    private readonly emailTransport: IEmailTransport,
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

  async sendForecastEmail(payload: IEmailPayload): Promise<void> {
    await this.emailTransport.sendMail({
      from: this.config.get<string>('EMAIL_USER') ?? '',
      ...payload,
    });
  }
}
