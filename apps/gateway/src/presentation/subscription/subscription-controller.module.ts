import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { SubscriptionGrpcClient } from '../../infrastructure/clients/subscription.client';
import { WeatherGrpcClient } from '../../infrastructure/clients/weather.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SUBSCRIPTION_PACKAGE } from '../../application/subscription.client.interface';
import { WEATHER_PACKAGE } from '../../application/weather.client.interface';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: SUBSCRIPTION_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'subscription',
          protoPath: 'libs/proto/src/subscription.proto',
          url: 'subscription:4002',
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
    ]),
  ],
  providers: [SubscriptionGrpcClient, WeatherGrpcClient],
  controllers: [SubscriptionController],
})
export class SubscriptionControllerModule {}
