import { Observable } from 'rxjs';
import { EmailPayload } from '../../../../../libs/constants/types/email';
import { SuccesResponse } from '../../../../../libs/proto/generated/email';

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface EmailServiceGrpc {
  sendForecastEmail(payload: EmailPayload): Observable<SuccesResponse>;
}

export abstract class AppEmailClient {
  abstract sendForecastEmail(payload: EmailPayload): Promise<SuccesResponse>;
}
