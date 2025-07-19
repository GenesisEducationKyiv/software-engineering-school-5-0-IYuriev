import { Observable } from 'rxjs';
import {
  CityRequest,
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../libs/proto/generated/weather';

export interface GrpcWeatherClient {
  getWeather(data: CityRequest): Observable<GetWeatherResponse>;
  validateCity(data: CityRequest): Observable<ValidateCityResponse>;
}

export interface AppWeatherClient {
  getWeather(data: CityRequest): Promise<GetWeatherResponse>;
  validateCity(data: CityRequest): Promise<ValidateCityResponse>;
}

export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');
