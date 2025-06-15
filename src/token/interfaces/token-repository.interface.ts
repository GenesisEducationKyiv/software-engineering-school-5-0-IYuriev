import { IToken } from 'src/constants/types/token.interface';

export interface ITokenRepository {
  create(token: string, subscriptionId: number): Promise<void>;
  findByToken(token: string): Promise<IToken | null>;
}

export const TokenRepositoryToken = Symbol('TokenRepository');
