import { Frequency, SubscriptionEntity } from './subscription.entity';

export type SubscriptionPayload = {
  email: string;
  city: string;
  frequency: Frequency;
};

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
