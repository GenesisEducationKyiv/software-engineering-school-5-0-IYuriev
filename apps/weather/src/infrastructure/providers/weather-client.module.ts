import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../libs/common/cache/cache.module';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { OpenWeatherProvider } from './open-weather.provider';
import { WeatherApiProvider } from './weather-api.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, CacheModule, ConfigModule],
  providers: [OpenWeatherProvider, WeatherApiProvider],
  exports: [WeatherApiProvider, OpenWeatherProvider],
})
export class WeatherClientModule {}
