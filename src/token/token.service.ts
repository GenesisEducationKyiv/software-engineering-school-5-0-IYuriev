import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createConfirmToken(subscriptionId: number): Promise<string> {
    const token = uuidv4();
    await this.prisma.token.create({
      data: {
        token,
        subscriptionId,
      },
    });
    return token;
  }

  async getValidToken(token: string) {
    const dbToken = await this.prisma.token.findUnique({ where: { token } });
    if (!dbToken) throw new BadRequestException('Invalid token');
    return dbToken;
  }
}
