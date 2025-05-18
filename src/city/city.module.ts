import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { FetchService } from 'src/fetch/fetch.service';

@Module({
  providers: [CityService, FetchService],
  exports: [CityService],
})
export class CityModule {}
