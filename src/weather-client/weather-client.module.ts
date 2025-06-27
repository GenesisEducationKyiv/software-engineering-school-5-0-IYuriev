import { Module } from '@nestjs/common';
import { WeatherApiClient } from './weather-api-client';
import { HttpModule } from '../infrastructure/http/http.module';
import { CacheModule } from '../cache/cache.module';
import { OpenWeatherClient } from './open-weather-client';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [OpenWeatherClient, WeatherApiClient],
  exports: [WeatherApiClient, OpenWeatherClient],
})
export class WeatherClientModule {}
