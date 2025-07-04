import { CreateSubscriptionDto } from '../../application/subscription/dto/create-subscription.dto';

export interface SubscriptionProvider {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
