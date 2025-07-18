import { Observable } from 'rxjs';
import {
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../libs/proto/generated/weather';

export interface WeatherClient {
  getWeather(data: { city: string }): Observable<GetWeatherResponse>;
  validateCity(data: { city: string }): Observable<ValidateCityResponse>;
}

export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');
