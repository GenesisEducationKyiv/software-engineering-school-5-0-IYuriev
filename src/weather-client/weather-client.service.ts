import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchService } from '../fetch/fetch.service';
import { WeatherApiEndpoint } from '../constants/enums/weather';
import { IWeatherData } from '../constants/types/weather.interface';
import { IWeatherClientService } from './interfaces/weather-service.interface';
import { ICityResponse } from 'src/constants/types/city.interface';

@Injectable()
export class WeatherClientService implements IWeatherClientService {
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;

  constructor(
    private readonly fetchService: FetchService,
    private readonly config: ConfigService,
  ) {
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async fetchWeather(city: string): Promise<IWeatherData> {
    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.CURRENT}?key=${this.API_KEY}&q=${city}&aqi=yes`;
    return this.fetchService.get<IWeatherData>(url);
  }

  async searchCity(city: string): Promise<ICityResponse[]> {
    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.SEARCH}?key=${this.API_KEY}&q=${city}`;
    return this.fetchService.get<ICityResponse[]>(url);
  }
}
