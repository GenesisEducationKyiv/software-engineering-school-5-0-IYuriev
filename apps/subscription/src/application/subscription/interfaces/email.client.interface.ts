import { Observable } from 'rxjs';

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface EmailClient {
  sendConfirmationEmail(data: {
    email: string;
    token: string;
  }): Observable<{ success: boolean }>;
}
