import { SubscriptionPayload } from '../../../domain/subscription/subscription-service.interface';
import {
  Frequency,
  SubscriptionEntity,
} from '../../../domain/subscription/subscription.entity';

export interface SubscriptionRepo {
  getConfirmedSubscriptions(
    frequency: Frequency,
  ): Promise<SubscriptionEntity[]>;
  findSubscription(
    payload: SubscriptionPayload,
  ): Promise<SubscriptionEntity | null>;
  create(payload: SubscriptionPayload): Promise<SubscriptionEntity>;
  confirm(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');
