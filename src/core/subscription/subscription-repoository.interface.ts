import { Frequency } from '../../constants/enums/subscription';
import { Subscription } from '../../constants/types/subscription';
import { CreateSubscriptionDto } from '../../application/subscription/dto/create-subscription.dto';

export interface SubscriptionRepo {
  getConfirmedSubscriptions(frequency: Frequency): Promise<Subscription[]>;
  findSubscription(dto: CreateSubscriptionDto): Promise<Subscription | null>;
  create(dto: CreateSubscriptionDto): Promise<Subscription>;
  confirm(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');
