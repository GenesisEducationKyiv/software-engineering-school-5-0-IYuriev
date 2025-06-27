import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  TokenRepo,
  TokenRepositoryToken,
} from './interfaces/token-repository.interface';
import { TokenProvider } from './interfaces/token-service.interface';
import { Token } from '../constants/types/token';

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
