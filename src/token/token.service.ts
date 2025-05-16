import { Injectable } from '@nestjs/common';
import { TokenType } from 'src/constants/enums/subscription';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createConfirmToken(subscriptionId: number): Promise<string> {
    const token = uuidv4();
    await this.prisma.token.create({
      data: {
        token,
        type: TokenType.CONFIRM,
        subscriptionId,
        expiresAt: this.getExpiryDate(),
      },
    });
    return token;
  }

  private getExpiryDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24);
  }
}
