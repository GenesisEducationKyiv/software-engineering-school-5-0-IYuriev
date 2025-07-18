import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { EmailPayload } from '../../../../../libs/constants/types/email';
import {
  EMAIL_PACKAGE,
  EmailServiceGrpc,
} from '../../application/interfaces/email.client.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EmailGrpcClient implements OnModuleInit {
  private emailService: EmailServiceGrpc;

  constructor(@Inject(EMAIL_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.emailService =
      this.client.getService<EmailServiceGrpc>('EmailService');
  }

  async sendForecastEmail(payload: EmailPayload): Promise<void> {
    await lastValueFrom(this.emailService.sendForecastEmail(payload));
  }
}
