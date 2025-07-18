import { Injectable } from '@nestjs/common';
import { CityValidatable, WeatherClient } from '../../domain/weather.interface';
import { WeatherProvider } from '../providers/weather-client.provider';
import { CacheService } from '../../../../../libs/common/cache/application/cache.interface';
import { Weather } from '../../domain/weather.entity';
import { CacheKey } from '../../../../../libs/constants/enums/cache';

@Injectable()
export class CacheWeatherClientProxy implements WeatherClient {
  constructor(
    private readonly provider: WeatherProvider & CityValidatable,
    private readonly cacheService: CacheService,
  ) {}

  async getWeather(city: string): Promise<Weather> {
    const cacheKey = this.getCacheKey(city);
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as Weather;
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
