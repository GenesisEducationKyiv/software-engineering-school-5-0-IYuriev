import { SendConfirmationEmailRequest } from '../../../../../../libs/proto/generated/email';

export abstract class EmailPublish {
  abstract sendConfirmationEmail(payload: SendConfirmationEmailRequest): void;
}
