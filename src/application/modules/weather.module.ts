import { Module } from '@nestjs/common';
import { WeatherService } from '../weather/use-cases/weather.service';
import { WeatherController } from '../../presentation/weather/weather.controller';
import { WeatherClientModule } from 'src/application/modules/weather-client.module';
import { WeatherClientToken } from 'src/core/weather/weather.interface';
import { WeatherFactory } from '../../infrastructure/factories/weather-factory';
import { LoggerModule } from './logger.module';
import { CacheModule } from './cache.module';

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
