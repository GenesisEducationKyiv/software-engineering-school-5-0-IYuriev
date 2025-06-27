import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { CacheWeatherClientProxy } from '../common/proxies/cache-weather-client.proxy';
import { WeatherClient } from './interfaces/weather-service.interface';
import { WeatherApiClient } from '../weather-client/weather-api-client';
import { OpenWeatherClient } from '../weather-client/open-weather-client';
import { WinstonLogger } from '../infrastructure/logger/logger.service';
import { LogWeatherClientDecorator } from '../common/decorators/log-weather-client.decorator';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly weatherAPI: WeatherApiClient,
    private readonly openWeather: OpenWeatherClient,
    private readonly cache: CacheService,
    private readonly logger: WinstonLogger,
  ) {}

  create(): WeatherClient {
    const loggedWeatherAPI = new LogWeatherClientDecorator(
      this.weatherAPI,
      this.logger,
      'weatherapi.com',
    );
    const loggedOpenWeather = new LogWeatherClientDecorator(
      this.openWeather,
      this.logger,
      'openweathermap.org',
    );
    loggedWeatherAPI.setNext(loggedOpenWeather);

    return new CacheWeatherClientProxy(loggedWeatherAPI, this.cache);
  }
}
