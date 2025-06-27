import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiEndpoint } from '../constants/enums/weather';
import { WeatherAPIData, WeatherResponse } from '../constants/types/weather';
import { CityResponse } from 'src/constants/types/city';
import { HttpClient } from 'src/infrastructure/http/http.client';
import {
  CityValidatable,
  WeatherClient,
} from '../weather/interfaces/weather-service.interface';
import { WeatherProvider } from './weather-client.provider';

@Injectable()
export class WeatherApiClient
  extends WeatherProvider
  implements WeatherClient, CityValidatable
{
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: ConfigService,
  ) {
    super();
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async getWeather(city: string): Promise<WeatherResponse> {
    const data = await this.fetchWeather(city);
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }

  async validateCity(city: string): Promise<string> {
    const cities = await this.searchCity(city);
    if (!cities?.length) throw new NotFoundException('City not found');
    return cities[0].name;
  }

  private async fetchWeather(city: string): Promise<WeatherAPIData> {
    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.CURRENT}?key=${this.API_KEY}&q=${city}&aqi=yes`;
    return this.httpClient.get<WeatherAPIData>(url);
  }

  private async searchCity(city: string): Promise<CityResponse[]> {
    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.SEARCH}?key=${this.API_KEY}&q=${city}`;
    return this.httpClient.get<CityResponse[]>(url);
  }
}
