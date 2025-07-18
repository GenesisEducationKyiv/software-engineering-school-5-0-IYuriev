import { Subscription, Token } from '@prisma/client';
import { mapToTokenEntity } from './token.mapper';
import {
  Frequency,
  SubscriptionEntity,
} from '../../../../subscription/src/domain/subscription/subscription.entity';

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
