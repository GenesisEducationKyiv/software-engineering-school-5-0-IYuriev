import { SubscriptionEntity } from '../subscription/subscription.entity';

export interface TokenEntity {
  id: number;
  token: string;
  subscriptionId: number;
  subscription: SubscriptionEntity;
  createdAt: Date;
}
