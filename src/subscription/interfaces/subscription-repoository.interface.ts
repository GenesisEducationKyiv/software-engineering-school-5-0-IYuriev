import { NotificationFrequency } from 'src/constants/enums/subscription';
import { ISubscription } from 'src/constants/types/subscription';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export interface ISubscriptionRepository {
  getConfirmedSubscriptions(
    frequency: NotificationFrequency,
  ): Promise<ISubscription[]>;
  findSubscription(dto: CreateSubscriptionDto): Promise<ISubscription | null>;
  create(dto: CreateSubscriptionDto): Promise<ISubscription>;
  confirm(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');
