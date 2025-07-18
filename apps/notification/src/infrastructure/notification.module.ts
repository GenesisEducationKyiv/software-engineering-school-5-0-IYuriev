import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMAIL_PACKAGE } from '../application/interfaces/email.client.interface';
import { EmailGrpcClient } from './clients/email.client';
import { WeatherGrpcClient } from './clients/weather.client';
import { WEATHER_PACKAGE } from '../application/interfaces/weather.client.interface';
import { SUBSCRIPTION_PACKAGE } from '../application/interfaces/subscription.client.interface';
import { SubscriptionGrpcClient } from './clients/subscription.client';

@Module({
  imports: [
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
  providers: [EmailGrpcClient, WeatherGrpcClient, SubscriptionGrpcClient],
  exports: [EmailGrpcClient, WeatherGrpcClient, SubscriptionGrpcClient],
})
export class NotificationModule {}
