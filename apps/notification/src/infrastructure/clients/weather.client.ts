import { Inject, Injectable } from '@nestjs/common';
import {
  CityRequest,
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../../libs/proto/generated/weather';
import { lastValueFrom } from 'rxjs';
import {
  AppWeatherClient,
  WeatherClient,
} from '../../application/interfaces/weather.client.interface';

@Injectable()
export class GrpcWeatherClient implements AppWeatherClient {
  constructor(
    @Inject('WeatherService')
    private readonly weatherService: WeatherClient,
  ) {}

  async getWeather(data: CityRequest): Promise<GetWeatherResponse> {
    return await lastValueFrom(
      this.weatherService.getWeather({ city: data.city }),
    );
  }

  async validateCity(data: CityRequest): Promise<ValidateCityResponse> {
    return await lastValueFrom(
      this.weatherService.validateCity({ city: data.city }),
    );
  }
}
