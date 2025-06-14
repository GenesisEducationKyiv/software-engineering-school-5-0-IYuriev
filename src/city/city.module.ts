import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { FetchService } from 'src/fetch/fetch.service';
import { WeatherClientService } from 'src/weather-client/weather-client.service';

@Module({
  providers: [CityService, FetchService, WeatherClientService],
  exports: [CityService],
})
export class CityModule {}
