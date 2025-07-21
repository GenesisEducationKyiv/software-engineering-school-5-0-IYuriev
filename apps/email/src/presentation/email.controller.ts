import {
  SendConfirmationEmailRequest,
  SendForecastEmailRequest,
  SuccesResponse,
} from './../../../../libs/proto/generated/email';
import { Controller } from '@nestjs/common';
import { EmailProvider } from '../domain/email-service.interface';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailProvider) {}

  @GrpcMethod('EmailService', 'SendConfirmationEmail')
  async sendConfirmationEmail(
    data: SendConfirmationEmailRequest,
  ): Promise<SuccesResponse> {
    await this.emailService.sendConfirmationEmail(data.email, data.token);
    return { success: true };
  }

  @GrpcMethod('EmailService', 'SendForecastEmail')
  async sendForecastEmail(
    data: SendForecastEmailRequest,
  ): Promise<SuccesResponse> {
    await this.emailService.sendForecastEmail(data);
    return { success: true };
  }
}
