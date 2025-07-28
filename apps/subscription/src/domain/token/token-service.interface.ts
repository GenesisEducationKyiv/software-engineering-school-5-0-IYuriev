import { TokenEntity } from './token.entity';

export abstract class TokenProvider {
  abstract createConfirmToken(subscriptionId: number): Promise<string>;
  abstract getValidToken(token: string): Promise<TokenEntity>;
}
