import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../libs/constants/types/email';

export abstract class EmailProvider {
  abstract sendConfirmationEmail(
    payload: EmailConfirmationPayload,
  ): Promise<void>;
  abstract sendForecastEmail(payload: EmailForecastPayload): Promise<void>;
}
