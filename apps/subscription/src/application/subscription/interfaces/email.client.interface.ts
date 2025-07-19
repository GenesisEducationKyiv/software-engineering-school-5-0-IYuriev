import {
  SendConfirmationEmailRequest,
  SuccesResponse,
} from '../../../../../../libs/proto/generated/email';
import { Observable } from 'rxjs';

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface GrpcEmailClient {
  sendConfirmationEmail(
    data: SendConfirmationEmailRequest,
  ): Observable<SuccesResponse>;
}

export interface AppEmailClient {
  sendConfirmationEmail(
    data: SendConfirmationEmailRequest,
  ): Promise<SuccesResponse>;
}

export const APP_EMAIL_CLIENT = Symbol('AppEmailClient');
