import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AppWeatherClient,
  GrpcWeatherClient,
  WEATHER_PACKAGE,
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
export class WeatherGrpcClient implements OnModuleInit, AppWeatherClient {
  private weatherService: GrpcWeatherClient;

  constructor(@Inject(WEATHER_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.weatherService =
      this.client.getService<GrpcWeatherClient>('WeatherService');
  }

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
