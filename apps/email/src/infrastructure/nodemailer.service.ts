import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Email } from '../../../../libs/constants/enums/email';
import * as nodemailer from 'nodemailer';
import { EmailTransport } from '../application/interfaces/email-transport.interface';

@Injectable()
export class NodemailerService implements EmailTransport {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: Email.SERVICE,
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    await this.transporter.sendMail(options);
  }
}
