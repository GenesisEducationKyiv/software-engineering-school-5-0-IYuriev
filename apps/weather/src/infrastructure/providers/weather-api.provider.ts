import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Weather } from '../../domain/weather.entity';
import { WeatherProvider } from './weather-client.provider';
import { CityValidatable, WeatherClient } from '../../domain/weather.interface';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { WeatherAPIData } from '../../../../../libs/constants/types/weather';
import { WeatherApiEndpoint } from '../../../../../libs/constants/enums/weather';
import { CityResponse } from '../../../../../libs/constants/types/city';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WeatherApiProvider
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

  async getWeather(city: string): Promise<Weather> {
    const data = await this.fetchWeather(city);
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }

  async validateCity(city: string): Promise<string> {
    try {
      const cities = await this.searchCity(city);
      if (!cities?.length) throw new RpcException('City not found');
      return cities[0].name;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new RpcException('Internal server error');
    }
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
