import { Subscription } from '../../../../../libs/constants/types/subscription';

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

export abstract class NotificationSend {
  abstract send(sub: Subscription): Promise<void>;
  abstract sendByFrequency(frequency: Frequency): Promise<void>;
}
