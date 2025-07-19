import { Inject, Injectable } from '@nestjs/common';
import { EmailPayload } from '../../../../../libs/constants/types/email';
import {
  AppEmailClient,
  EmailServiceGrpc,
} from '../../application/interfaces/email.client.interface';
import { lastValueFrom } from 'rxjs';
import { SuccesResponse } from '../../../../../libs/proto/generated/email';

@Injectable()
export class GrpcEmailClient implements AppEmailClient {
  constructor(
    @Inject('EmailService')
    private readonly emailService: EmailServiceGrpc,
  ) {}

  async sendForecastEmail(payload: EmailPayload): Promise<SuccesResponse> {
    await lastValueFrom(this.emailService.sendForecastEmail(payload));
    return { success: true };
  }
}
