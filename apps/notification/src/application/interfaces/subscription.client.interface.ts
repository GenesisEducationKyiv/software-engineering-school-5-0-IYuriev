import { SubscriptionEntity } from 'apps/subscription/src/domain/subscription/subscription.entity';
import { GetConfirmedSubscriptionsRequest } from '../../../../../libs/proto/generated/subscription';
import { Observable } from 'rxjs';

export interface SubscriptionClient {
  getConfirmedSubscriptions(
    data: GetConfirmedSubscriptionsRequest,
  ): Observable<SubscriptionEntity[]>;
}

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');
