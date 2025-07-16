import { SubscriptionDto } from '../../../subscription/src/presentation/dto/subscription.dto';

export interface SubscriptionClient {
  subscribe(payload: SubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
