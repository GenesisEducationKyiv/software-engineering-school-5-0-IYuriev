import { Observable } from 'rxjs';
import { EmailPayload } from '../../../../../libs/constants/types/email';
import { SuccesResponse } from '../../../../../libs/proto/generated/email';

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface EmailServiceGrpc {
  sendForecastEmail(payload: EmailPayload): Observable<SuccesResponse>;
}

export interface AppEmailClient {
  sendForecastEmail(payload: EmailPayload): Promise<SuccesResponse>;
}

export const APP_EMAIL_CLIENT = Symbol('AppEmailClient');
