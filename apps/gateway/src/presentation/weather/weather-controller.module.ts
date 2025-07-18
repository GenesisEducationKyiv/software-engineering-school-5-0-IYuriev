import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WEATHER_PACKAGE } from '../../application/weather.client.interface';
import { WeatherGrpcClient } from '../../infrastructure/clients/weather.client';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
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
  providers: [WeatherGrpcClient],
  controllers: [WeatherController],
})
export class WeatherControllerModule {}
