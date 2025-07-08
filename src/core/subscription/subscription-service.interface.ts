import { Frequency } from './subscription.entity';

export type SubscriptionPayload = {
  email: string;
  city: string;
  frequency: Frequency;
};

export interface SubscriptionProvider {
  subscribe(payload: SubscriptionPayload): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
