import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  EMAIL_PACKAGE,
  EmailClient,
} from '../../application/subscription/interfaces/email.client.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EmailGrpcClient implements OnModuleInit {
  private emailService: EmailClient;

  constructor(@Inject(EMAIL_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.emailService = this.client.getService<EmailClient>('EmailService');
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    await lastValueFrom(
      this.emailService.sendConfirmationEmail({ email, token }),
    );
  }
}
