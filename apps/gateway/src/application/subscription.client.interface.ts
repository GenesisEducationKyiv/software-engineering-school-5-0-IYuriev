import {
  SubscribeRequest,
  SuccessResponse,
  TokenRequest,
} from '../../../../libs/proto/generated/subscription';
import { Observable } from 'rxjs';

export interface GrpcSubscriptionClient {
  subscribe(payload: SubscribeRequest): Observable<SuccessResponse>;
  confirm(data: TokenRequest): Observable<SuccessResponse>;
  unsubscribe(data: TokenRequest): Observable<SuccessResponse>;
}

export interface AppSubscriptionClient {
  subscribe(payload: SubscribeRequest): Promise<SuccessResponse>;
  confirm(data: TokenRequest): Promise<SuccessResponse>;
  unsubscribe(data: TokenRequest): Promise<SuccessResponse>;
}

export const APP_SUBSCRIPTION_CLIENT = Symbol('AppSubscriptionClient');
export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
