import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { Weather } from '../../../../weather/src/domain/weather.entity';
import { WeatherClient } from '../../application/weather.client.interface';

@Injectable()
export class WeatherHttpClient implements WeatherClient {
  constructor(private readonly httpClient: HttpClient) {}

  async getWeather(city: string): Promise<Weather> {
    return this.httpClient.get<Weather>(
      `http://weather:4001/weather/${encodeURIComponent(city)}`,
    );
  }

  async validateCity(city: string): Promise<string> {
    return this.httpClient.get<string>(
      `http://weather:4001/validate-city/${encodeURIComponent(city)}`,
    );
  }
}
