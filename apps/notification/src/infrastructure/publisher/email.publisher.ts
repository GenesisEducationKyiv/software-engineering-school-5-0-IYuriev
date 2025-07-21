import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  EMAIL_EVENTS,
  EmailPayload,
} from '../../../../../libs/constants/types/email';

@Injectable()
export class EmailPublisher {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  sendEmailEvent(payload: EmailPayload) {
    this.kafkaClient.emit(EMAIL_EVENTS.SEND_FORECAST_EMAIL, payload);
  }
}
