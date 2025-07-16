import { TokenEntity } from './token.entity';

export interface TokenProvider {
  createConfirmToken(subscriptionId: number): Promise<string>;
  getValidToken(token: string): Promise<TokenEntity>;
}
export const TokenServiceToken = Symbol('TokenService');
