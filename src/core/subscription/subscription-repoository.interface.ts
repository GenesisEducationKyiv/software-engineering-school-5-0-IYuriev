import { Subscription } from '../../constants/types/subscription';
import { Frequency } from './subscription.entity';

export type CreateSubscriptionPayload = {
  email: string;
  city: string;
  frequency: Frequency;
};

export interface SubscriptionRepo {
  getConfirmedSubscriptions(frequency: Frequency): Promise<Subscription[]>;
  findSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<Subscription | null>;
  create(payload: CreateSubscriptionPayload): Promise<Subscription>;
  confirm(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');
