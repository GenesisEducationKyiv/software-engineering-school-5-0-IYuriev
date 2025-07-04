import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Token } from 'src/constants/types/token';
import { TokenProvider } from 'src/core/token/token-service.interface';
import {
  TokenRepo,
  TokenRepositoryToken,
} from 'src/core/token/token-repository.interface';

@Injectable()
export class TokenService implements TokenProvider {
  constructor(
    @Inject(TokenRepositoryToken)
    private readonly tokenRepo: TokenRepo,
  ) {}

  async createConfirmToken(subscriptionId: number): Promise<string> {
    const token = randomUUID();
    await this.tokenRepo.create(token, subscriptionId);
    return token;
  }

  async getValidToken(token: string): Promise<Token> {
    const dbToken = await this.tokenRepo.findByToken(token);
    if (!dbToken) throw new BadRequestException('Invalid token');
    return dbToken;
  }
}
