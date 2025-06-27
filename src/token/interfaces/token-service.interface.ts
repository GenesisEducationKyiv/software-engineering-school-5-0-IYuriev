import { Token } from '../../constants/types/token';

export interface TokenProvider {
  createConfirmToken(subscriptionId: number): Promise<string>;
  getValidToken(token: string): Promise<Token>;
}
export const TokenServiceToken = Symbol('TokenService');
