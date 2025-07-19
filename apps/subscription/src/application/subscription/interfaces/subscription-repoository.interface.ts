import { SubscriptionPayload } from '../../../domain/subscription/subscription-service.interface';
import {
  Frequency,
  SubscriptionEntity,
} from '../../../domain/subscription/subscription.entity';

export abstract class SubscriptionRepo {
  abstract getConfirmedSubscriptions(
    frequency: Frequency,
  ): Promise<SubscriptionEntity[]>;
  abstract findSubscription(
    payload: SubscriptionPayload,
  ): Promise<SubscriptionEntity | null>;
  abstract create(payload: SubscriptionPayload): Promise<SubscriptionEntity>;
  abstract confirm(id: number): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
