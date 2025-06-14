import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export interface ISubscriptionService {
  subscribe(dto: CreateSubscriptionDto): Promise<{ message: string }>;
  confirm(token: string): Promise<{ message: string }>;
  unsubscribe(token: string): Promise<{ message: string }>;
}
