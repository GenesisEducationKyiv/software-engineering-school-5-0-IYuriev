import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import {
  AppEmailClient,
  EMAIL_PACKAGE,
} from '../application/interfaces/email.client.interface';
import { GrpcEmailClient } from './clients/email.client';
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

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: EMAIL_PACKAGE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'email',
            protoPath: 'libs/proto/src/email.proto',
            url: config.get<string>('EMAIL_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
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
    ]),
  ],
  providers: [
    NotificationService,
    {
      provide: AppSubscriptionClient,
      useClass: SubscriptionGrpcClient,
    },
    {
      provide: NotificationSend,
      useClass: NotificationSender,
    },
    {
      provide: AppEmailClient,
      useClass: GrpcEmailClient,
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
      provide: 'EmailService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcEmailClient>('EmailService'),
      inject: [EMAIL_PACKAGE],
    },
    {
      provide: 'WeatherService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcWeatherClient>('WeatherService'),
      inject: [WEATHER_PACKAGE],
    },
  ],
  exports: [
    AppEmailClient,
    AppWeatherClient,
    AppSubscriptionClient,
    NotificationSend,
  ],
})
export class NotificationModule {}
