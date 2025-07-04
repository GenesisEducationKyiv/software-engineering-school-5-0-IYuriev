import { Module } from '@nestjs/common';
import { WeatherApiClient } from '../../infrastructure/weather/weather-api-client';
import { HttpModule } from './http.module';
import { CacheModule } from './cache.module';
import { OpenWeatherClient } from 'src/infrastructure/weather/open-weather-client';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [OpenWeatherClient, WeatherApiClient],
  exports: [WeatherApiClient, OpenWeatherClient],
})
export class WeatherClientModule {}
