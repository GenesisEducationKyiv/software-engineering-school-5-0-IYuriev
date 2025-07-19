import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import {
  AppWeatherClient,
  GrpcWeatherClient,
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
      provide: AppWeatherClient,
      useExisting: WeatherGrpcClient,
    },
    {
      provide: 'WeatherService',
      useFactory: (client: ClientGrpc) =>
        client.getService<GrpcWeatherClient>('WeatherService'),
      inject: [WEATHER_PACKAGE],
    },
  ],
  controllers: [WeatherController],
})
export class WeatherControllerModule {}
