import { Inject, Injectable } from '@nestjs/common';
import { CacheWeatherClientProxy } from '../proxies/cache-weather-client.proxy';
import { WeatherApiProvider } from '../providers/weather-api.provider';
import { OpenWeatherProvider } from '../providers/open-weather.provider';
import { LogWeatherClientDecorator } from '../decorators/log-weather-client.decorator';
import { CacheService } from '../../../../../libs/common/cache/application/cache.interface';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { WeatherClient } from '../../domain/weather.interface';
import { WEATHER_MODULE_LOGGER } from '../../../../../libs/common/logger/logger.module';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly weatherAPI: WeatherApiProvider,
    private readonly openWeather: OpenWeatherProvider,
    private readonly cache: CacheService,
    @Inject(WEATHER_MODULE_LOGGER) private readonly logger: WinstonLogger,
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
