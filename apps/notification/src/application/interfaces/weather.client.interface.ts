import {
  ValidateCityResponse,
  GetWeatherResponse,
} from '../../../../../libs/proto/generated/weather';
import { Observable } from 'rxjs';

export interface WeatherClient {
  getWeather(data: ValidateCityResponse): Observable<GetWeatherResponse>;
  validateCity(data: ValidateCityResponse): Observable<ValidateCityResponse>;
}

export abstract class AppWeatherClient {
  abstract getWeather(data: ValidateCityResponse): Promise<GetWeatherResponse>;
  abstract validateCity(
    data: ValidateCityResponse,
  ): Promise<ValidateCityResponse>;
}

export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');
