import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenRepository } from './token.repository';
import { TokenRepositoryToken } from './interfaces/token-repository.interface';
import { TokenServiceToken } from './interfaces/token-service.interface';

@Module({
  providers: [
    TokenService,
    PrismaService,
    TokenRepository,
    {
      provide: TokenRepositoryToken,
      useExisting: TokenRepository,
    },
    {
      provide: TokenServiceToken,
      useExisting: TokenService,
    },
  ],
  exports: [TokenServiceToken, TokenRepositoryToken],
})
export class TokenModule {}
