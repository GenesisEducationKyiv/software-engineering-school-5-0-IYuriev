import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailPublisher } from './publishers/email.publisher';
import { EmailPublish } from '../application/subscription/interfaces/email.publisher.interface';
import { SubscriptionService } from '../application/subscription/use-cases/subscription.service';
import { LogUseCaseSubscriptionDecorator } from '../common/decorators/log-use-case-subscription.decorator';
import { WinstonLogger } from '../../../../libs/common/logger/logger.service';
import { SubscriptionProvider } from '../domain/subscription/subscription-service.interface';
import {
  SUBSCRIPTION_REPO_LOGGER,
  SUBSCRIPTION_SERVICE_LOGGER,
} from '../../../../libs/common/logger/logger.module';
import { SubscriptionRepository } from './subscription/subscription.repository';
import { SubscriptionRepo } from '../application/subscription/interfaces/subscription-repoository.interface';
import { TokenModule } from './token/token.module';
import { HttpModule } from '../../../../libs/common/http/http.module';
import { PrismaModule } from './prisma/prisma.module';
import { LogSubscriptionRepoDecorator } from '../common/decorators/log-subscription-repo.decorator';

@Module({
  imports: [
    HttpModule,
    TokenModule,
    ConfigModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [config.get<string>('KAFKA_BROKER_URL')].filter(
                Boolean,
              ) as string[],
            },
            consumer: {
              groupId: 'subscription-service',
            },
            producer: {
              allowAutoTopicCreation: true,
            },
            producerOnlyMode: true,
          },
        }),

        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    {
      provide: SubscriptionRepo,
      useFactory: (repo: SubscriptionRepository, logger: WinstonLogger) =>
        new LogSubscriptionRepoDecorator(repo, logger),
      inject: [SubscriptionRepository, SUBSCRIPTION_REPO_LOGGER],
    },
    {
      provide: EmailPublish,
      useClass: EmailPublisher,
    },
    {
      provide: SubscriptionProvider,
      useFactory: (provider: SubscriptionService, logger: WinstonLogger) =>
        new LogUseCaseSubscriptionDecorator(provider, logger),
      inject: [SubscriptionService, SUBSCRIPTION_SERVICE_LOGGER],
    },
  ],
  exports: [EmailPublish, SubscriptionProvider, SubscriptionRepo],
})
export class SubscriptionModule {}
