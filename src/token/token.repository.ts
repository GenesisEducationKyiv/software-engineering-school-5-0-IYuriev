import { Injectable } from '@nestjs/common';
import { ITokenRepository } from './interfaces/token-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { IToken } from 'src/constants/types/token.interface';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscriptionId: number): Promise<void> {
    await this.prisma.token.create({ data: { token, subscriptionId } });
  }

  async findByToken(token: string): Promise<IToken | null> {
    return this.prisma.token.findUnique({ where: { token } });
  }
}
