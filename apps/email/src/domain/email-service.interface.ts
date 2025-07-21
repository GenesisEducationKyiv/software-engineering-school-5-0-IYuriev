import { EmailPayload } from '../../../../libs/constants/types/email';

export abstract class EmailProvider {
  abstract sendConfirmationEmail(email: string, token: string): Promise<void>;
  abstract sendForecastEmail(payload: EmailPayload): Promise<void>;
}
