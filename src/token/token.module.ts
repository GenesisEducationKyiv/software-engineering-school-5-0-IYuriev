import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
      useClass: TokenRepository,
    },
    {
      provide: TokenServiceToken,
      useClass: TokenService,
    },
  ],
  exports: [TokenServiceToken, TokenRepositoryToken],
})
export class TokenModule {}
