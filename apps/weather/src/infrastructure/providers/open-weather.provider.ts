import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherProvider } from './weather-client.provider';
import { CityValidatable, WeatherClient } from '../../domain/weather.interface';
import { Weather } from '../../domain/weather.entity';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { OpenWeatherData } from '../../../../../libs/constants/types/weather';

@Injectable()
export class OpenWeatherProvider
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
    this.API_KEY = this.config.get<string>('OPEN_WEATHER_API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('OPEN_WEATHER_API_URL', '');
  }

  async getWeather(city: string): Promise<Weather> {
    const data = await this.fetchWeather(city);
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }

  async validateCity(city: string): Promise<string> {
    try {
      const data = await this.fetchWeather(city);
      return data.name;
    } catch (e) {
      if (e instanceof HttpException && e.getStatus() === 404) {
        throw new NotFoundException('City not found');
      }
      throw e;
    }
  }

  private async fetchWeather(city: string): Promise<OpenWeatherData> {
    const url = `${this.WEATHER_API_URL}${city}&appid=${this.API_KEY}&units=metric`;
    return this.httpClient.get<OpenWeatherData>(url);
  }
}
