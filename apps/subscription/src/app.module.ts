import { Module } from '@nestjs/common';
import { SubscriptionService } from './application/subscription/use-cases/subscription.service';
import { SubscriptionServiceToken } from './domain/subscription/subscription-service.interface';
import { SubscriptionApiController } from './presentation/subscription.controller';
import { TokenModule } from './infrastucture/token/token.module';
import { HttpModule } from '../../../libs/common/http/http.module';
import { SubscriptionRepository } from './infrastucture/subscription/subscription.repository';
import { PrismaService } from './infrastucture/prisma/prisma.service';
import { SubscriptionRepositoryToken } from './application/subscription/interfaces/subscription-repoository.interface';
import { SubscriptionModule } from './infrastucture/subscription.module';

@Module({
  imports: [TokenModule, HttpModule, SubscriptionModule],
  controllers: [SubscriptionApiController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
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
})
export class AppModule {}
