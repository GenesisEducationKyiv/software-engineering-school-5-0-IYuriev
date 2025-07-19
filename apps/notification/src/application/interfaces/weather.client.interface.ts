import {
  ValidateCityResponse,
  GetWeatherResponse,
} from '../../../../../libs/proto/generated/weather';
import { Observable } from 'rxjs';

export interface WeatherClient {
  getWeather(data: ValidateCityResponse): Observable<GetWeatherResponse>;
  validateCity(data: ValidateCityResponse): Observable<ValidateCityResponse>;
}

export interface AppWeatherClient {
  getWeather(data: ValidateCityResponse): Promise<GetWeatherResponse>;
  validateCity(data: ValidateCityResponse): Promise<ValidateCityResponse>;
}

export const APP_WEATHER_CLIENT = Symbol('AppWeatherClient');
export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');
