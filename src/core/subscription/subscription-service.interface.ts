import { CreateSubscriptionPayload } from './subscription-repoository.interface';

export interface SubscriptionProvider {
  subscribe(payload: CreateSubscriptionPayload): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
