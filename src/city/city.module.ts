import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { FetchService } from '../fetch/fetch.service';
import { WeatherClientModule } from '../weather-client/weather-client.module';

@Module({
  imports: [WeatherClientModule],
  providers: [CityService, FetchService],
  exports: [CityService],
})
export class CityModule {}
