import { EmailForecastPayload } from '../../../../../libs/constants/types/email';

export abstract class EmailPublish {
  abstract sendEmailEvent(payload: EmailForecastPayload): void;
}
