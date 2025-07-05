import { Module } from '@nestjs/common';
import { TokenService } from '../token/use-cases/token.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TokenRepository } from 'src/infrastructure/token/token.repository';
import { TokenRepositoryToken } from 'src/core/token/token-repository.interface';
import { TokenServiceToken } from 'src/core/token/token-service.interface';

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
