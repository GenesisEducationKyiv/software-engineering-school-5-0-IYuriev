import { IWeatherResponse } from 'src/constants/types/weather.interface';

export interface IWeatherService {
  getWeather(city: string): Promise<IWeatherResponse>;
}
