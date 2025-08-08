import { Inject, Injectable } from '@nestjs/common';
import { CacheWeatherClientProxy } from '../proxies/cache-weather-client.proxy';
import { WeatherApiProvider } from '../providers/weather-api.provider';
import { OpenWeatherProvider } from '../providers/open-weather.provider';
import { LogWeatherClientDecorator } from '../../common/decorators/log-weather-client.decorator';
import { CacheService } from '../../../../../libs/common/cache/application/cache.interface';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { WeatherClient } from '../../domain/weather.interface';
import { WEATHER_MODULE_LOGGER } from '../../../../../libs/common/logger/logger.module';
import { MetricsWeatherDecorator } from '../../common/decorators/metrics-weather.decorator';
import { MetricsService } from '../../common/metrics/metrics.service';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly weatherAPI: WeatherApiProvider,
    private readonly openWeather: OpenWeatherProvider,
    private readonly cache: CacheService,
    @Inject(WEATHER_MODULE_LOGGER) private readonly logger: WinstonLogger,
    private readonly metrics: MetricsService,
  ) {}

  create(): WeatherClient {
    const metricsWeatherAPI = new MetricsWeatherDecorator(
      this.weatherAPI,
      this.metrics,
    );
    const metricsOpenWeather = new MetricsWeatherDecorator(
      this.openWeather,
      this.metrics,
    );
    const loggedWeatherAPI = new LogWeatherClientDecorator(
      metricsWeatherAPI,
      this.logger,
      'weatherapi.com',
    );
    const loggedOpenWeather = new LogWeatherClientDecorator(
      metricsOpenWeather,
      this.logger,
      'openweathermap.org',
    );
    loggedWeatherAPI.setNext(loggedOpenWeather);

    return new CacheWeatherClientProxy(loggedWeatherAPI, this.cache);
  }
}
