import { Injectable } from '@nestjs/common';
import { WeatherClient } from '../../core/weather/weather.interface';
import { CacheService } from '../../core/cache/cache.abstract';
import { WinstonLogger } from '../logger/logger.service';
import { CacheWeatherClientProxy } from '../weather/proxies/cache-weather-client.proxy';
import { WeatherApiClient } from '../weather/weather-api-client';
import { OpenWeatherClient } from '../weather/open-weather-client';
import { LogWeatherClientDecorator } from '../weather/decorators/log-weather-client.decorator';

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
