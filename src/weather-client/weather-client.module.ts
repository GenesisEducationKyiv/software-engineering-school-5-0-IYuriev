import { Module } from '@nestjs/common';
import { WeatherClientService } from './weather-client.service';
import { FetchModule } from '../fetch/fetch.module';
import { WeatherClientServiceToken } from './interfaces/weather-service.interface';

@Module({
  imports: [FetchModule],
  providers: [
    WeatherClientService,
    {
      provide: WeatherClientServiceToken,
      useExisting: WeatherClientService,
    },
  ],
  exports: [WeatherClientServiceToken],
})
export class WeatherClientModule {}
