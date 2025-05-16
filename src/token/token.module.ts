import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  exports: [TokenService],
  providers: [TokenService, PrismaService],
})
export class TokenModule {}
