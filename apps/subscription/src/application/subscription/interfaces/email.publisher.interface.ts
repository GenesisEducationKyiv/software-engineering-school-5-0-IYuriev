import { SendConfirmationEmailRequest } from '../../../../../../libs/proto/generated/email';

export abstract class EmailPublisher {
  abstract sendConfirmationEmail(payload: SendConfirmationEmailRequest): void;
}
