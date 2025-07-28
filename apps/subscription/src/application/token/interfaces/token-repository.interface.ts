import { TokenEntity } from '../../../domain/token/token.entity';

export abstract class TokenRepo {
  abstract create(token: string, subscriptionId: number): Promise<void>;
  abstract findByToken(token: string): Promise<TokenEntity | null>;
}
