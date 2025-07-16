import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';

@Injectable()
export class WeatherHttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async validateCity(city: string): Promise<string> {
    return this.httpClient.get<string>(
      `http://weather:4001/validate-city/${encodeURIComponent(city)}`,
    );
  }
}
