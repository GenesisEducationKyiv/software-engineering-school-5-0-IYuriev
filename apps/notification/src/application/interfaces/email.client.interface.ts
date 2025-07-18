import { Observable } from 'rxjs';
import { EmailPayload } from '../../../../../libs/constants/types/email';

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface EmailServiceGrpc {
  sendForecastEmail(payload: EmailPayload): Observable<{ success: boolean }>;
}
