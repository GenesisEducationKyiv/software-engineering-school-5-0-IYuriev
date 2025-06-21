import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { CacheWeatherClientDecorator } from '../common/decorators/cache-weather-client.decorator';
import { WeatherClient } from './interfaces/weather-service.interface';
import { HttpWeatherClient } from '../weather-client/http-weather-client';
import { OpenWeatherClient } from '../weather-client/openweather-client';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly weatherAPI: HttpWeatherClient,
    private readonly openWeather: OpenWeatherClient,
    private readonly cache: CacheService,
  ) {}

  create(): WeatherClient {
    this.weatherAPI.setNext(this.openWeather);
    return new CacheWeatherClientDecorator(this.weatherAPI, this.cache);
  }
}
