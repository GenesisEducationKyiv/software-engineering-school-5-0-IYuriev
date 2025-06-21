import { Module } from '@nestjs/common';
import { HttpWeatherClient } from './http-weather-client';
import { HttpModule } from '../infrastructure/http/http.module';
import { CacheModule } from '../cache/cache.module';
import { OpenWeatherClient } from './openweather-client';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [OpenWeatherClient, HttpWeatherClient],
  exports: [HttpWeatherClient, OpenWeatherClient],
})
export class WeatherClientModule {}
