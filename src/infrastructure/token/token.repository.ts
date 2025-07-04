import { Injectable } from '@nestjs/common';
import { TokenRepo } from '../../core/token/token-repository.interface';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Token } from '../../constants/types/token';

@Injectable()
export class TokenRepository implements TokenRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscriptionId: number): Promise<void> {
    await this.prisma.token.create({ data: { token, subscriptionId } });
  }

  async findByToken(token: string): Promise<Token | null> {
    return this.prisma.token.findUnique({ where: { token } });
  }
}
