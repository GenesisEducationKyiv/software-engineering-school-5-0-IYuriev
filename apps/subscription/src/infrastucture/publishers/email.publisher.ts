import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EMAIL_EVENTS } from '../../../../../libs/constants/types/email';
import { SendConfirmationEmailRequest } from '../../../../../libs/proto/generated/email';
import { EmailPublish } from '../../application/subscription/interfaces/email.publisher.interface';

@Injectable()
export class EmailPublisher implements EmailPublish {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  sendConfirmationEmail(payload: SendConfirmationEmailRequest) {
    this.kafkaClient.emit(EMAIL_EVENTS.SEND_CONFIRMATION_EMAIL, payload);
  }
}
