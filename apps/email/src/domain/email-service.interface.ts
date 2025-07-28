import { EmailPayload } from '../../../../libs/constants/types/email';

export interface EmailProvider {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendForecastEmail(payload: EmailPayload): Promise<void>;
}

export const EmailServiceToken = Symbol('EmailService');
