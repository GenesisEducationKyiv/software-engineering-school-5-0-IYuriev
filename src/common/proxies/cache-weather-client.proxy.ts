import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { CacheKey } from '../../constants/enums/cache';
import { WeatherResponse } from '../../constants/types/weather';
import {
  CityValidatable,
  WeatherClient,
} from '../../weather/interfaces/weather-service.interface';
import { WeatherProvider } from 'src/weather-client/weather-client.provider';

@Injectable()
export class CacheWeatherClientProxy implements WeatherClient {
  constructor(
    private readonly provider: WeatherProvider & CityValidatable,
    private readonly cacheService: CacheService,
  ) {}

  async getWeather(city: string): Promise<WeatherResponse> {
    const cacheKey = this.getCacheKey(city);
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as WeatherResponse;
    }

    const weather = await this.provider.handle(city);
    await this.cacheService.set(cacheKey, JSON.stringify(weather));
    return weather;
  }

  async validateCity(city: string): Promise<string> {
    return this.provider.checkCity(city);
  }

  private getCacheKey(city: string): string {
    return `${CacheKey.WEATHER}:${city}`;
  }
}
