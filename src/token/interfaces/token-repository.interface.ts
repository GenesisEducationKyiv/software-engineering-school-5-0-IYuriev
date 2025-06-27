import { Token } from '../../constants/types/token';

export interface TokenRepo {
  create(token: string, subscriptionId: number): Promise<void>;
  findByToken(token: string): Promise<Token | null>;
}

export const TokenRepositoryToken = Symbol('TokenRepository');
