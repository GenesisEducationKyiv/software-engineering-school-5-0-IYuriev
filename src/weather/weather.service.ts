import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IWeatherData,
  IWeatherResponse,
} from '../constants/types/weather.interface';
import { FetchService } from '../fetch/fetch.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { CacheService } from 'src/cache/cache.service';
import { CacheKey } from 'src/constants/enums/cacheKey';
import { WeatherApiEndpoint } from 'src/constants/enums/weather';
import { CityService } from 'src/city/city.service';

@Injectable()
export class WeatherService {
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;

  constructor(
    private readonly fetchService: FetchService,
    private readonly config: ConfigService,
    private readonly cacheService: CacheService,
    private readonly cityService: CityService,
  ) {
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async getWeather({ city }: GetWeatherDto): Promise<IWeatherResponse> {
    const validCity = await this.cityService.validateCity(city);
    const cacheKey = `${CacheKey.WEATHER}:${validCity}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData) as IWeatherResponse;

    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.CURRENT}?key=${this.API_KEY}&q=${validCity}&aqi=yes`;
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
