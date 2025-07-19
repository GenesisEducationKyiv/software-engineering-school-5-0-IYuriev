import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  APP_EMAIL_CLIENT,
  EMAIL_PACKAGE,
} from '../application/interfaces/email.client.interface';
import { EmailGrpcClient } from './clients/email.client';
import { WeatherGrpcClient } from './clients/weather.client';
import {
  APP_WEATHER_CLIENT,
  WEATHER_PACKAGE,
} from '../application/interfaces/weather.client.interface';
import {
  APP_SUBSCRIPTION_CLIENT,
  SUBSCRIPTION_PACKAGE,
} from '../application/interfaces/subscription.client.interface';
import { SubscriptionGrpcClient } from './clients/subscription.client';
import { NotificationSenderToken } from '../application/interfaces/notification-repository.interface';
import { NotificationSender } from './notification.repository';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from '../application/use-case/notification.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: EMAIL_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: 'libs/proto/src/email.proto',
          url: 'email:4000',
        },
      },
      {
        name: WEATHER_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'weather',
          protoPath: 'libs/proto/src/weather.proto',
          url: 'weather:4001',
        },
      },
      {
        name: SUBSCRIPTION_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'subscription',
          protoPath: 'libs/proto/src/subscription.proto',
          url: 'subscription:4002',
        },
      },
    ]),
  ],
  providers: [
    NotificationService,
    {
      provide: APP_SUBSCRIPTION_CLIENT,
      useClass: SubscriptionGrpcClient,
    },
    {
      provide: NotificationSenderToken,
      useClass: NotificationSender,
    },
    {
      provide: APP_EMAIL_CLIENT,
      useClass: EmailGrpcClient,
    },
    {
      provide: APP_WEATHER_CLIENT,
      useClass: WeatherGrpcClient,
    },
  ],
  exports: [
    APP_EMAIL_CLIENT,
    APP_WEATHER_CLIENT,
    APP_SUBSCRIPTION_CLIENT,
    NotificationSenderToken,
  ],
})
export class NotificationModule {}
