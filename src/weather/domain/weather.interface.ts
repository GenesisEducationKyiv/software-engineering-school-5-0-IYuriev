import { Weather } from '../../weather/domain/weather.entity';

export interface WeatherClient {
  getWeather(city: string): Promise<Weather>;
}

export interface CityValidatable {
  validateCity(city: string): Promise<string>;
}

export const WeatherClientToken = Symbol('WeatherClient');
