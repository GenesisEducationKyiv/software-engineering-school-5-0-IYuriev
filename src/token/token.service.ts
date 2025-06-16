import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  ITokenRepository,
  TokenRepositoryToken,
} from './interfaces/token-repository.interface';
import { ITokenService } from './interfaces/token-service.interface';
import { IToken } from '../constants/types/token.interface';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @Inject(TokenRepositoryToken)
    private readonly tokenRepo: ITokenRepository,
  ) {}

  async createConfirmToken(subscriptionId: number): Promise<string> {
    const token = uuidv4();
    await this.tokenRepo.create(token, subscriptionId);
    return token;
  }

  async getValidToken(token: string): Promise<IToken> {
    const dbToken = await this.tokenRepo.findByToken(token);
    if (!dbToken) throw new BadRequestException('Invalid token');
    return dbToken;
  }
}
