import { Module } from '@nestjs/common';
import { WeatherService } from './application/weather.service';
import { WeatherClientModule } from './infrastructure/providers/weather-client.module';
import { WeatherClientToken } from './domain/weather.interface';
import { WeatherFactory } from './infrastructure/factories/weather-factory';
import { LoggerModule } from '../common/logger/logger.module';
import { CacheModule } from '../common/cache/cache.module';
import { WeatherApiController } from './presentation/weather.controller';
import { WeatherApiClient } from './presentation/weather.client';
import { HttpModule } from 'src/common/http/http.module';

@Module({
  imports: [CacheModule, WeatherClientModule, LoggerModule, HttpModule],
  controllers: [WeatherApiController],
  providers: [
    WeatherService,
    WeatherFactory,
    WeatherApiClient,
    {
      provide: WeatherClientToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherApiClient, WeatherClientToken],
})
export class WeatherModule {}
