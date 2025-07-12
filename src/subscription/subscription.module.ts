import { Module } from '@nestjs/common';
import { SubscriptionService } from './application/subscription/use-cases/subscription.service';
import { PrismaService } from 'src/subscription/infrastucture/prisma/prisma.service';
import { EmailModule } from '../email/email.module';
import { TokenModule } from 'src/subscription/infrastucture/token/token.module';
import { SubscriptionRepository } from 'src/subscription/infrastucture/subscription/subscription.repository';
import { SubscriptionRepositoryToken } from 'src/subscription/application/subscription/interfaces/subscription-repoository.interface';
import { SubscriptionServiceToken } from './domain/subscription/subscription-service.interface';
import { SubscriptionApiController } from './presentation/subscription.controller';
import { SubscriptionClient } from './presentation/subscription.client';
import { HttpModule } from 'src/common/http/http.module';

@Module({
  imports: [EmailModule, TokenModule, HttpModule],
  controllers: [SubscriptionApiController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    SubscriptionClient,
    PrismaService,
    {
      provide: SubscriptionRepositoryToken,
      useExisting: SubscriptionRepository,
    },
    {
      provide: SubscriptionServiceToken,
      useExisting: SubscriptionService,
    },
  ],
  exports: [SubscriptionClient],
})
export class SubscriptionModule {}
