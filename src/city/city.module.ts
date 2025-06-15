import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { FetchService } from 'src/fetch/fetch.service';
import { WeatherClientModule } from 'src/weather-client/weather-client.module';

@Module({
  imports: [WeatherClientModule],
  providers: [CityService, FetchService],
  exports: [CityService],
})
export class CityModule {}
