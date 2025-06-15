import { IEmailPayload } from 'src/constants/types/email.interface';

export interface IEmailService {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendForecastEmail(payload: IEmailPayload): Promise<void>;
}

export const EmailServiceToken = Symbol('EmailService');
