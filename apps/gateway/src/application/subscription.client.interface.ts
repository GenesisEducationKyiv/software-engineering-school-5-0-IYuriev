import {
  SubscribeRequest,
  SuccessResponse,
  TokenRequest,
} from '../../../../libs/proto/generated/subscription';
import { Observable } from 'rxjs';

export interface SubscriptionClient {
  subscribe(payload: SubscribeRequest): Observable<SuccessResponse>;
  confirm(data: TokenRequest): Observable<SuccessResponse>;
  unsubscribe(data: TokenRequest): Observable<SuccessResponse>;
}

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
