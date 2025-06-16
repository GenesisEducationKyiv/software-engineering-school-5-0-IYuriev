import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CacheModule } from '../cache/cache.module';
import { WeatherClientModule } from '../weather-client/weather-client.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [CacheModule, WeatherClientModule, CityModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
