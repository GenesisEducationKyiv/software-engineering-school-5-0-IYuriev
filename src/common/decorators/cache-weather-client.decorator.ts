import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { CacheKey } from '../../constants/enums/cache';
import { WeatherResponse } from '../../constants/types/weather';
import { WeatherClient } from '../../weather-client/interfaces/weather-service.interface';

@Injectable()
export class CacheWeatherClientDecorator implements WeatherClient {
  constructor(
    private readonly weatherClient: WeatherClient,
    private readonly cacheService: CacheService,
  ) {}

  async getWeather(city: string): Promise<WeatherResponse> {
    const cacheKey = `${CacheKey.WEATHER}:${city}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as WeatherResponse;
    }

    const weather = await this.weatherClient.getWeather(city);
    await this.cacheService.set(cacheKey, JSON.stringify(weather));
    return weather;
  }
}
