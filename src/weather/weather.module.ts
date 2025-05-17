import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { FetchService } from 'src/fetch/fetch.service';
import { CacheService } from 'src/cache/cache.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, FetchService, CacheService],
})
export class WeatherModule {}
