import { Injectable } from '@nestjs/common';
import { TokenRepo } from '../../application/token/interfaces/token-repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { TokenEntity } from '../../../../subscription/src/domain/token/token.entity';

@Injectable()
export class TokenRepository implements TokenRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscriptionId: number): Promise<void> {
    await this.prisma.token.create({ data: { token, subscriptionId } });
  }

  async findByToken(token: string): Promise<TokenEntity | null> {
    return this.prisma.token.findUnique({ where: { token } });
  }
}
