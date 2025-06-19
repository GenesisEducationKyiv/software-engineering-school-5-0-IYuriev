import { WeatherResponse } from '../../constants/types/weather';

export interface WeatherClient {
  getWeather(city: string): Promise<WeatherResponse>;
  validateCity?(city: string): Promise<string>;
}

export const WeatherClientToken = Symbol('WeatherClient');
