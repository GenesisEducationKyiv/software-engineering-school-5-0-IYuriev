import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../domain/weather.entity';
import {
  CityValidatable,
  WeatherClient,
  WeatherClientToken,
} from '../domain/weather.interface';

@Injectable()
export class WeatherService implements WeatherClient, CityValidatable {
  constructor(
    @Inject(WeatherClientToken)
    private readonly client: WeatherClient & CityValidatable,
  ) {}

  async getWeather(city: string): Promise<Weather> {
    return this.client.getWeather(city);
  }

  async validateCity(city: string): Promise<string> {
    return await this.client.validateCity(city);
  }
}
