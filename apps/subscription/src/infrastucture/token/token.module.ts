import { Module } from '@nestjs/common';
import { TokenService } from '../../application/token/use-cases/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenRepository } from './token.repository';
import { TokenRepo } from '../../application/token/interfaces/token-repository.interface';
import { TokenProvider } from '../../../../subscription/src/domain/token/token-service.interface';

@Module({
  providers: [
    TokenService,
    PrismaService,
    TokenRepository,
    {
      provide: TokenRepo,
      useExisting: TokenRepository,
    },
    {
      provide: TokenProvider,
      useExisting: TokenService,
    },
  ],
  exports: [TokenRepo, TokenProvider],
})
export class TokenModule {}
