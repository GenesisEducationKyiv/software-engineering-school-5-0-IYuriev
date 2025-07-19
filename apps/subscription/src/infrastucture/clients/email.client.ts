import { Inject, Injectable } from '@nestjs/common';
import {
  AppEmailClient,
  GrpcEmailClient,
} from '../../application/subscription/interfaces/email.client.interface';
import { lastValueFrom } from 'rxjs';
import {
  SendConfirmationEmailRequest,
  SuccesResponse,
} from '../../../../../libs/proto/generated/email';

@Injectable()
export class EmailGrpcClient implements AppEmailClient {
  constructor(
    @Inject('EmailService')
    private readonly emailService: GrpcEmailClient,
  ) {}

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
