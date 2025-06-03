import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Email } from '../constants/enums/email';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private text: string = Email.TEXT;
  private subject: string = Email.SUBJECT;
  private confirmationUrl = this.config.get<string>('CONFIRMATION_URL');

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: Email.SERVICE,
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(email: string, token: string): Promise<void> {
    const link = `${this.confirmationUrl}/${token}`;

    await this.transporter.sendMail({
      from: this.config.get<string>('EMAIL_USER'),
      to: email,
      subject: this.subject,
      text: `${this.text}${link}`,
    });
  }

  async sendForecastEmail(
    email: string,
    subject: string,
    text: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('EMAIL_USER'),
      to: email,
      subject,
      text,
    });
  }
}
