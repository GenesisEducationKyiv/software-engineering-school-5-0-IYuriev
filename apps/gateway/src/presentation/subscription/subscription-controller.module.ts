import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { SubscriptionGrpcClient } from '../../infrastructure/clients/subscription.client';
import { WeatherGrpcClient } from '../../infrastructure/clients/weather.client';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  AppSubscriptionClient,
  GrpcSubscriptionClient,
  SUBSCRIPTION_PACKAGE,
} from '../../application/subscription.client.interface';
import {
  AppWeatherClient,
  GrpcWeatherClient,
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
      provide: AppWeatherClient,
      useExisting: WeatherGrpcClient,
    },
    {
      provide: AppSubscriptionClient,
      useClass: SubscriptionGrpcClient,
    },
    {
      provide: 'WeatherService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcWeatherClient>('WeatherService'),
      inject: [WEATHER_PACKAGE],
    },
    {
      provide: 'SubscriptionService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcSubscriptionClient>('SubscriptionService'),
      inject: [SUBSCRIPTION_PACKAGE],
    },
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionControllerModule {}
