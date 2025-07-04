import { Frequency } from '../../constants/enums/subscription';
import { TokenEntity } from '../token/token.entity';

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
