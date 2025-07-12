import { TokenEntity } from 'src/subscription/domain/token/token.entity';

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

export interface SubscriptionEntity {
  id: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  tokens: TokenEntity[];
  createdAt: Date;
  updatedAt: Date;
}
