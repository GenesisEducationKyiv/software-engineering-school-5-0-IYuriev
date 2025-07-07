import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../../../core/weather/weather.entity';
import {
  WeatherClient,
  WeatherClientToken,
} from '../../../core/weather/weather.interface';

@Injectable()
export class WeatherService implements WeatherClient {
  constructor(
    @Inject(WeatherClientToken)
    private readonly client: WeatherClient,
  ) {}

  async getWeather(city: string): Promise<Weather> {
    return this.client.getWeather(city);
  }
}
