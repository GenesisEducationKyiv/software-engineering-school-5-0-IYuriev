import { NotificationFrequency } from '../../constants/enums/subscription';
import { Subscription } from '../../constants/types/subscription';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export interface SubscriptionRepo {
  getConfirmedSubscriptions(
    frequency: NotificationFrequency,
  ): Promise<Subscription[]>;
  findSubscription(dto: CreateSubscriptionDto): Promise<Subscription | null>;
  create(dto: CreateSubscriptionDto): Promise<Subscription>;
  confirm(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');
