import {
  ValidateCityResponse,
  GetWeatherResponse,
} from '../../../../../libs/proto/generated/weather';
import { Observable } from 'rxjs';

export interface WeatherClient {
  getWeather(data: { city: string }): Observable<GetWeatherResponse>;
  validateCity(data: { city: string }): Observable<ValidateCityResponse>;
}

export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');
