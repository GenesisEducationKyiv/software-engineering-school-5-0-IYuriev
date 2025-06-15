import { ICityResponse } from 'src/constants/types/city.interface';
import { IWeatherData } from 'src/constants/types/weather.interface';

export interface IWeatherClientService {
  fetchWeather(city: string): Promise<IWeatherData>;
  searchCity(city: string): Promise<ICityResponse[]>;
}

export const WeatherClientServiceToken = Symbol('WeatherClientService');
