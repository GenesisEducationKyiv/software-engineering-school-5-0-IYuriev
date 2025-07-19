import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  APP_WEATHER_CLIENT,
  WEATHER_PACKAGE,
} from '../../application/weather.client.interface';
import { WeatherGrpcClient } from '../../infrastructure/clients/weather.client';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
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
    ]),
  ],
  providers: [
    WeatherGrpcClient,
    {
      provide: APP_WEATHER_CLIENT,
      useExisting: WeatherGrpcClient,
    },
  ],
  controllers: [WeatherController],
})
export class WeatherControllerModule {}
