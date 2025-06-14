import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CacheModule } from 'src/cache/cache.module';
import { WeatherClientModule } from 'src/weather-client/weather-client.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [CacheModule, WeatherClientModule, CityModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
