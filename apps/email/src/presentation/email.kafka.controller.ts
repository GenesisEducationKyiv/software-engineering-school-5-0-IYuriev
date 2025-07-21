import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailProvider } from '../domain/email-service.interface';
import {
  EMAIL_EVENTS,
  EmailPayload,
} from '../../../../libs/constants/types/email';

@Controller()
export class EmailKafkaController {
  constructor(private readonly emailService: EmailProvider) {}

  @EventPattern(EMAIL_EVENTS.SEND_FORECAST_EMAIL)
  async handleEmailEvent(@Payload() payload: EmailPayload): Promise<void> {
    await this.emailService.sendForecastEmail(payload);
  }
}
