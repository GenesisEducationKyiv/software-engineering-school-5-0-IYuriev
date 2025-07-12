import { Subscription, Token } from '@prisma/client';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/subscription/domain/subscription/subscription.entity';
import { mapToTokenEntity } from './token.mapper';

export function mapToSubscriptionEntity(
  sub: Subscription & { tokens?: Token[] },
): SubscriptionEntity {
  return {
    id: sub.id,
    email: sub.email,
    city: sub.city,
    frequency: sub.frequency as Frequency,
    confirmed: sub.confirmed,
    tokens: (sub.tokens || []).map(mapToTokenEntity),
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
  };
}
