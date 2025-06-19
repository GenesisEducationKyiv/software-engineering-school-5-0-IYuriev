import { Module } from '@nestjs/common';
import { HttpWeatherClient } from './http-weather-client';
import { HttpModule } from '../infrastructure/http/http.module';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { WeatherClientToken } from './interfaces/weather-service.interface';
import { CacheWeatherClientDecorator } from '../common/decorators/cache-weather-client.decorator';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [
    HttpWeatherClient,
    {
      provide: WeatherClientToken,
      useFactory: (
        httpClient: HttpWeatherClient,
        cacheService: CacheService,
      ) => {
        return new CacheWeatherClientDecorator(httpClient, cacheService);
      },
      inject: [HttpWeatherClient, CacheService],
    },
  ],
  exports: [WeatherClientToken],
})
export class WeatherClientModule {}
