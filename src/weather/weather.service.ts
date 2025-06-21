import { Inject, Injectable } from '@nestjs/common';
import { WeatherResponse } from '../constants/types/weather';
import {
  WeatherClient,
  WeatherClientToken,
} from './interfaces/weather-service.interface';

@Injectable()
export class WeatherService implements WeatherClient {
  constructor(
    @Inject(WeatherClientToken)
    private readonly client: WeatherClient,
  ) {}

  async getWeather(city: string): Promise<WeatherResponse> {
    return this.client.getWeather(city);
  }
}
