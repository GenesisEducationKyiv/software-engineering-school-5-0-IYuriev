import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CityRequest,
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../../libs/proto/generated/weather';
import { lastValueFrom } from 'rxjs';
import {
  AppWeatherClient,
  WEATHER_PACKAGE,
  WeatherClient,
} from '../../application/interfaces/weather.client.interface';

@Injectable()
export class WeatherGrpcClient implements OnModuleInit, AppWeatherClient {
  private weatherService: WeatherClient;

  constructor(@Inject(WEATHER_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.weatherService =
      this.client.getService<WeatherClient>('WeatherService');
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
