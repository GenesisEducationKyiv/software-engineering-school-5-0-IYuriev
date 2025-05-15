import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { FetchService } from 'src/fetch/fetch.service';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [WeatherService, FetchService],
})
export class WeatherModule {}
