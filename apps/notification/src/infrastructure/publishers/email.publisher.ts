import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  EMAIL_EVENTS,
  EmailForecastPayload,
} from '../../../../../libs/constants/types/email';
import { EmailPublish } from '../../application/interfaces/email.publisher.interface';

@Injectable()
export class EmailPublisher implements EmailPublish {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  sendEmailEvent(payload: EmailForecastPayload) {
    this.kafkaClient.emit(EMAIL_EVENTS.SEND_FORECAST_EMAIL, payload);
  }
}
