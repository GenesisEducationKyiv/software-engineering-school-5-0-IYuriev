import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TokenEntity } from 'src/core/token/token.entity';
import { TokenProvider } from 'src/core/token/token-service.interface';
import {
  TokenRepo,
  TokenRepositoryToken,
} from '../interfaces/token-repository.interface';

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

  async getValidToken(token: string): Promise<TokenEntity> {
    const dbToken = await this.tokenRepo.findByToken(token);
    if (!dbToken) throw new BadRequestException('Invalid token');
    return dbToken;
  }
}
