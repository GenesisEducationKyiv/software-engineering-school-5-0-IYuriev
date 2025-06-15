import { Inject, Injectable } from '@nestjs/common';
import { IWeatherService } from './interfaces/weather-service.interface';
import { IWeatherResponse } from '../constants/types/weather.interface';
import { CacheKey } from '../constants/enums/cache';
import {
  CacheServiceToken,
  ICacheService,
} from 'src/cache/interfaces/cache-service.interface';
import {
  IWeatherClientService,
  WeatherClientServiceToken,
} from 'src/weather-client/interfaces/weather-service.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @Inject(CacheServiceToken)
    private readonly cache: ICacheService,
    @Inject(WeatherClientServiceToken)
    private readonly client: IWeatherClientService,
  ) {}

  async getWeather(city: string): Promise<IWeatherResponse> {
    const cacheKey = `${CacheKey.WEATHER}:${city}`;
    const cachedData = await this.cache.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData) as IWeatherResponse;

    const data = await this.client.fetchWeather(city);
    const result: IWeatherResponse = {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };

    await this.cache.set(cacheKey, JSON.stringify(result));
    return result;
  }
}
