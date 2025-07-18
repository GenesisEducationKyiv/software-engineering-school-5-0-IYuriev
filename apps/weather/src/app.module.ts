import { Module } from '@nestjs/common';
import { CacheModule } from '../../../libs/common/cache/cache.module';
import { WeatherClientModule } from 'apps/weather/src/infrastructure/providers/weather-client.module';
import { LoggerModule } from '../../../libs/common/logger/logger.module';
import { HttpModule } from '../../../libs/common/http/http.module';
import { WeatherService } from './application/weather.service';
import { WeatherClientToken } from './domain/weather.interface';
import { WeatherApiController } from './presentation/weather.controller';
import { WeatherFactory } from './infrastructure/factories/weather-factory';

@Module({
  imports: [CacheModule, WeatherClientModule, LoggerModule, HttpModule],
  controllers: [WeatherApiController],
  providers: [
    WeatherService,
    WeatherFactory,
    {
      provide: WeatherClientToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
})
export class AppModule {}
