import { GetConfirmedSubscriptionsRequest } from '../../../../../libs/proto/generated/subscription';
import { Observable } from 'rxjs';
import { Frequency } from '../use-case/notification.service';

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

export interface SubscriptionClient {
  getConfirmedSubscriptions(
    data: GetConfirmedSubscriptionsRequest,
  ): Observable<SubscriptionEntity[]>;
}

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
