import { IToken } from 'src/constants/types/token.interface';

export interface ITokenService {
  createConfirmToken(subscriptionId: number): Promise<string>;
  getValidToken(token: string): Promise<IToken>;
}
export const TokenServiceToken = Symbol('TokenService');
