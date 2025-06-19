import { Subscription } from '../../constants/types/subscription';

export interface NotificationRepo {
  send(sub: Subscription): Promise<void>;
}

export const NotificationRepositoryToken = Symbol(
  'NotificationRepositoryToken',
);
