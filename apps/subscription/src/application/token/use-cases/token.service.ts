import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { TokenRepo } from '../interfaces/token-repository.interface';
import { TokenProvider } from '../../../domain/token/token-service.interface';
import { TokenEntity } from '../../../domain/token/token.entity';

@Injectable()
export class TokenService implements TokenProvider {
  constructor(private readonly tokenRepo: TokenRepo) {}

  async createConfirmToken(subscriptionId: number): Promise<string> {
    const token = randomUUID();
    await this.tokenRepo.create(token, subscriptionId);
    return token;
  }

  async getValidToken(token: string): Promise<TokenEntity> {
    const dbToken = await this.tokenRepo.findByToken(token);
    if (!dbToken) throw new RpcException({ code: 3, message: 'Invalid token' });
    return dbToken;
  }
}
