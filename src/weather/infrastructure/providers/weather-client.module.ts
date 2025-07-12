import { Module } from '@nestjs/common';
import { HttpModule } from 'src/common/http/http.module';
import { OpenWeatherProvider } from 'src/weather/infrastructure/providers/open-weather.provider';
import { WeatherApiProvider } from './weather-api.provider';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [OpenWeatherProvider, WeatherApiProvider],
  exports: [WeatherApiProvider, OpenWeatherProvider],
})
export class WeatherClientModule {}
