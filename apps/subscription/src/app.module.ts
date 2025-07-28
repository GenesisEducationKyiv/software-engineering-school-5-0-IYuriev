import { Module } from '@nestjs/common';
import { SubscriptionService } from './application/subscription/use-cases/subscription.service';
import { SubscriptionProvider } from './domain/subscription/subscription-service.interface';
import { SubscriptionApiController } from './presentation/subscription.controller';
import { TokenModule } from './infrastucture/token/token.module';
import { HttpModule } from '../../../libs/common/http/http.module';
import { SubscriptionRepository } from './infrastucture/subscription/subscription.repository';
import { PrismaService } from './infrastucture/prisma/prisma.service';
import { SubscriptionModule } from './infrastucture/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionRepo } from './application/subscription/interfaces/subscription-repoository.interface';

@Module({
  imports: [
    TokenModule,
    HttpModule,
    SubscriptionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [SubscriptionApiController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    PrismaService,
    {
      provide: SubscriptionRepo,
      useExisting: SubscriptionRepository,
    },
    {
      provide: SubscriptionProvider,
      useExisting: SubscriptionService,
    },
  ],
})
export class AppModule {}
