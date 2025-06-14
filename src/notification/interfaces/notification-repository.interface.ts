import { ISubscription } from 'src/constants/types/subscription';

export interface INotificationRepository {
  send(sub: ISubscription): Promise<void>;
}

export const NotificationRepositoryToken = Symbol(
  'NotificationRepositoryToken',
);
