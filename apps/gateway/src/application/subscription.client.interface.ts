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

export abstract class AppSubscriptionClient {
  abstract subscribe(payload: SubscribeRequest): Promise<SuccessResponse>;
  abstract confirm(data: TokenRequest): Promise<SuccessResponse>;
  abstract unsubscribe(data: TokenRequest): Promise<SuccessResponse>;
}

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
