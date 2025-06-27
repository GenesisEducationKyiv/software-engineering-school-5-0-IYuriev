import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CacheModule } from 'src/cache/cache.module';
import { WeatherClientModule } from 'src/weather-client/weather-client.module';
import { WeatherClientToken } from 'src/weather/interfaces/weather-service.interface';
import { WeatherFactory } from './weather-factory';
import { LoggerModule } from '../infrastructure/logger/logger.module';

@Module({
  imports: [CacheModule, WeatherClientModule, LoggerModule],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherFactory,
    {
      provide: WeatherClientToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherService, WeatherClientToken],
})
export class WeatherModule {}
