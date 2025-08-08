import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailProvider } from '../domain/email-service.interface';
import {
  EMAIL_EVENTS,
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../libs/constants/types/email';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailProvider) {}

  @EventPattern(EMAIL_EVENTS.SEND_FORECAST_EMAIL)
  async handleForecastEmailEvent(
    @Payload() payload: EmailForecastPayload,
  ): Promise<void> {
    await this.emailService.sendForecastEmail(payload);
  }

  @EventPattern(EMAIL_EVENTS.SEND_CONFIRMATION_EMAIL)
  async handleConfirmationEmailEvent(
    @Payload() payload: EmailConfirmationPayload,
  ): Promise<void> {
    await this.emailService.sendConfirmationEmail(payload);
  }
}
