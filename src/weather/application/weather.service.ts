import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../domain/weather.entity';
import { WeatherClient, WeatherClientToken } from '../domain/weather.interface';

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
