import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from 'src/common/http/http.client';
import { Weather } from '../domain/weather.entity';
import { WeatherClient } from '../domain/weather.interface';

@Injectable()
export class WeatherApiClient implements WeatherClient {
  private readonly BASE_URL: string;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: ConfigService,
  ) {
    this.BASE_URL = this.config.get<string>('BASE_URL') ?? '';
  }

  async getWeather(city: string): Promise<Weather> {
    return this.httpClient.get<Weather>(
      `${this.BASE_URL}/weather/${encodeURIComponent(city)}`,
    );
  }
}
