import { TokenEntity } from './token.entity';

export interface TokenRepo {
  create(token: string, subscriptionId: number): Promise<void>;
  findByToken(token: string): Promise<TokenEntity | null>;
}

export const TokenRepositoryToken = Symbol('TokenRepository');
