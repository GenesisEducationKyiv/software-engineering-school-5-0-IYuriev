import { Inject, Injectable } from '@nestjs/common';
import {
  AppWeatherClient,
  GrpcWeatherClient,
} from '../../application/weather.client.interface';
import {
  CityRequest,
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../../libs/proto/generated/weather';
import { lastValueFrom } from 'rxjs';

export interface Weather {
  temperature: number;
  humidity: number;
  description: string;
}

@Injectable()
export class WeatherGrpcClient implements AppWeatherClient {
  constructor(
    @Inject('WeatherService')
    private readonly weatherService: GrpcWeatherClient,
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
