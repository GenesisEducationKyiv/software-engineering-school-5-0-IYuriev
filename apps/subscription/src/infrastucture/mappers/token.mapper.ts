import { Token } from '@prisma/client';
import { TokenEntity } from '../../../../subscription/src/domain/token/token.entity';

export function mapToTokenEntity(token: Token): TokenEntity {
  return {
    id: token.id,
    token: token.token,
    subscriptionId: token.subscriptionId,
    createdAt: token.createdAt,
  };
}
