import { Injectable } from '@nestjs/common';
import { WeatherClient } from 'src/weather/domain/weather.interface';
import { CacheService } from '../../../common/cache/application/cache.interface';
import { WinstonLogger } from '../../../common/logger/logger.service';
import { CacheWeatherClientProxy } from '../proxies/cache-weather-client.proxy';
import { WeatherApiProvider } from '../providers/weather-api.provider';
import { OpenWeatherProvider } from '../providers/open-weather.provider';
import { LogWeatherClientDecorator } from '../decorators/log-weather-client.decorator';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly weatherAPI: WeatherApiProvider,
    private readonly openWeather: OpenWeatherProvider,
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
