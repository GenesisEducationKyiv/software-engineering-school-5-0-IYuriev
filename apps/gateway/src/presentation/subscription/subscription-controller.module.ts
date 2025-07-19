import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { SubscriptionGrpcClient } from '../../infrastructure/clients/subscription.client';
import { WeatherGrpcClient } from '../../infrastructure/clients/weather.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  APP_SUBSCRIPTION_CLIENT,
  SUBSCRIPTION_PACKAGE,
} from '../../application/subscription.client.interface';
import {
  APP_WEATHER_CLIENT,
  WEATHER_PACKAGE,
} from '../../application/weather.client.interface';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
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
    ]),
  ],
  providers: [
    WeatherGrpcClient,
    {
      provide: APP_WEATHER_CLIENT,
      useExisting: WeatherGrpcClient,
    },
    {
      provide: APP_SUBSCRIPTION_CLIENT,
      useClass: SubscriptionGrpcClient,
    },
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionControllerModule {}
