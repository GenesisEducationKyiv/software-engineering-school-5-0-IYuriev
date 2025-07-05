import { SubscriptionPayload } from './subscription-repoository.interface';

export interface SubscriptionProvider {
  subscribe(payload: SubscriptionPayload): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
