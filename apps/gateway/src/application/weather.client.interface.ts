import { Weather } from '../../../../apps/weather/src/domain/weather.entity';

export interface WeatherClient {
  getWeather(city: string): Promise<Weather>;
  validateCity(city: string): Promise<string>;
}
