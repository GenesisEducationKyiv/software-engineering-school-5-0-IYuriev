import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcWeatherClient } from './clients/weather.client';
import {
  AppWeatherClient,
  WEATHER_PACKAGE,
} from '../application/interfaces/weather.client.interface';
import {
  AppSubscriptionClient,
  GrpcSubscriptionClient,
  SUBSCRIPTION_PACKAGE,
} from '../application/interfaces/subscription.client.interface';
import { SubscriptionGrpcClient } from './clients/subscription.client';
import { NotificationSend } from '../application/interfaces/notification-sender.interface';
import { NotificationSender } from './notification.sender';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from '../application/use-case/notification.service';
import { EmailPublisher } from './publishers/email.publisher';
import { EmailPublish } from '../application/interfaces/email.publisher.interface';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: WEATHER_PACKAGE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'weather',
            protoPath: 'libs/proto/src/weather.proto',
            url: config.get<string>('WEATHER_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SUBSCRIPTION_PACKAGE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'subscription',
            protoPath: 'libs/proto/src/subscription.proto',
            url: config.get<string>('SUBSCRIPTION_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
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
              groupId: 'notification-service',
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
    NotificationService,
    EmailPublisher,
    {
      provide: AppSubscriptionClient,
      useClass: SubscriptionGrpcClient,
    },
    {
      provide: NotificationSend,
      useClass: NotificationSender,
    },
    {
      provide: EmailPublish,
      useClass: EmailPublisher,
    },
    {
      provide: AppWeatherClient,
      useClass: GrpcWeatherClient,
    },
    {
      provide: 'SubscriptionService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcSubscriptionClient>('SubscriptionService'),
      inject: [SUBSCRIPTION_PACKAGE],
    },
    {
      provide: 'WeatherService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcWeatherClient>('WeatherService'),
      inject: [WEATHER_PACKAGE],
    },
  ],
  exports: [
    AppWeatherClient,
    AppSubscriptionClient,
    NotificationSend,
    EmailPublish,
  ],
})
export class NotificationModule {}
