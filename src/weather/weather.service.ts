import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IWeatherData,
  IWeatherResponse,
} from '../constants/types/weather.interface';
import { FetchService } from '../fetch/fetch.service';
import { CacheService } from '../cache/cache.service';
import { CacheKey } from '../constants/enums/cacheKey';
import { WeatherApiEndpoint } from '../constants/enums/weather';

@Injectable()
export class WeatherService {
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;

  constructor(
    private readonly fetchService: FetchService,
    private readonly config: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async getWeather(city: string): Promise<IWeatherResponse> {
    const cacheKey = `${CacheKey.WEATHER}:${city}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData) as IWeatherResponse;

    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.CURRENT}?key=${this.API_KEY}&q=${city}&aqi=yes`;
    const data = await this.fetchService.get<IWeatherData>(url);
    const result = {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };

    await this.cacheService.set(cacheKey, JSON.stringify(result));
    return result;
  }
}
