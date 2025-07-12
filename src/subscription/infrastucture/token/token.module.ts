import { Module } from '@nestjs/common';
import { PrismaService } from 'src/subscription/infrastucture/prisma/prisma.service';
import { TokenRepository } from 'src/subscription/infrastucture/token/token.repository';
import { TokenRepositoryToken } from 'src/subscription/application/token/interfaces/token-repository.interface';
import { TokenServiceToken } from 'src/subscription/domain/token/token-service.interface';
import { TokenService } from '../../application/token/use-cases/token.service';

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
