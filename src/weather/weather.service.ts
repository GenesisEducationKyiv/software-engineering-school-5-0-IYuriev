import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherData } from '../constants/types/weather.interface';
import { FetchService } from '../fetch/fetch.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Injectable()
export class WeatherService {
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;

  constructor(
    private readonly fetchService: FetchService,
    private readonly config: ConfigService,
  ) {
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async getWeather({ city }: GetWeatherDto) {
    const url = `${this.WEATHER_API_URL}?key=${this.API_KEY}&q=${city}&aqi=yes`;

    const data = await this.fetchService.get<WeatherData>(url);
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
