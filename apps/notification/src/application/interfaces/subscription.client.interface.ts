import { GetConfirmedSubscriptionsRequest } from '../../../../../libs/proto/generated/subscription';
import { Observable } from 'rxjs';
import { Frequency } from './notification-sender.interface';

export interface SubscriptionEntity {
  id: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  tokens: TokenEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenEntity {
  id: number;
  token: string;
  subscriptionId: number;
  createdAt: Date;
}

export interface GrpcSubscriptionClient {
  getConfirmedSubscriptions(
    data: GetConfirmedSubscriptionsRequest,
  ): Observable<SubscriptionEntity[]>;
}

export abstract class AppSubscriptionClient {
  abstract getConfirmedSubscriptions(
    data: GetConfirmedSubscriptionsRequest,
  ): Promise<SubscriptionEntity[]>;
}

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
