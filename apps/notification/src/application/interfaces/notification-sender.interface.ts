import { Subscription } from '../../../../../libs/constants/types/subscription';

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

export interface NotificationSend {
  send(sub: Subscription): Promise<void>;
  sendByFrequency(frequency: Frequency): Promise<void>;
}

export const NotificationSenderToken = Symbol('NotificationSender');
