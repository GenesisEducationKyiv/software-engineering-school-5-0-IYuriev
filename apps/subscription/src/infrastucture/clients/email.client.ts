import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AppEmailClient,
  EMAIL_PACKAGE,
  GrpcEmailClient,
} from '../../application/subscription/interfaces/email.client.interface';
import { lastValueFrom } from 'rxjs';
import {
  SendConfirmationEmailRequest,
  SuccesResponse,
} from '../../../../../libs/proto/generated/email';

@Injectable()
export class EmailGrpcClient implements OnModuleInit, AppEmailClient {
  private emailService: GrpcEmailClient;

  constructor(@Inject(EMAIL_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.emailService = this.client.getService<GrpcEmailClient>('EmailService');
  }

  async sendConfirmationEmail(
    data: SendConfirmationEmailRequest,
  ): Promise<SuccesResponse> {
    await lastValueFrom(
      this.emailService.sendConfirmationEmail({
        email: data.email,
        token: data.token,
      }),
    );
    return { success: true };
  }
}
