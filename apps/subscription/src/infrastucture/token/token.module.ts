import { Module } from '@nestjs/common';
import { TokenService } from '../../application/token/use-cases/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenRepository } from './token.repository';
import { TokenRepositoryToken } from '../../application/token/interfaces/token-repository.interface';
import { TokenServiceToken } from '../../../../subscription/src/domain/token/token-service.interface';

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
