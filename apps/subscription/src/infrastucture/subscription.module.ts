import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MetricsService } from '../common/metrics/metrics.service';
import { MetricsSubscriptionDecorator } from '../common/decorators/metrics-subscription.decorator';
import { MetricsModule } from '../common/metrics/metrics.module';
import { KafkaEmailPublisher } from './publishers/email.publisher';
import { EmailPublisher } from '../application/subscription/interfaces/email.publisher.interface';

@Module({
  imports: [
    HttpModule,
    TokenModule,
    ConfigModule,
    PrismaModule,
    MetricsModule,
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
      provide: EmailPublisher,
      useClass: KafkaEmailPublisher,
    },
    {
      provide: SubscriptionProvider,
      useFactory: (
        provider: SubscriptionService,
        metrics: MetricsService,
        logger: WinstonLogger,
      ) => {
        const metricsDecorator = new MetricsSubscriptionDecorator(
          provider,
          metrics,
        );
        return new LogUseCaseSubscriptionDecorator(metricsDecorator, logger);
      },
      inject: [
        SubscriptionService,
        MetricsService,
        SUBSCRIPTION_SERVICE_LOGGER,
      ],
    },
  ],
  exports: [EmailPublisher, SubscriptionProvider, SubscriptionRepo],
})
export class SubscriptionModule {}
