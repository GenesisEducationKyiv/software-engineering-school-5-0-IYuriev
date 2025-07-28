import { Frequency } from './subscription.entity';

export type SubscriptionPayload = {
  email: string;
  city: string;
  frequency: Frequency;
};

export abstract class SubscriptionProvider {
  abstract subscribe(payload: SubscriptionPayload): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}
