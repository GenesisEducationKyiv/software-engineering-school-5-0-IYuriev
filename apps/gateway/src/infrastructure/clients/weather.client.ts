import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  WEATHER_PACKAGE,
  WeatherClient,
} from '../../application/weather.client.interface';
import {
  CityRequest,
  ValidateCityResponse,
} from '../../../../../libs/proto/generated/weather';
import { Weather } from 'apps/weather/src/domain/weather.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherGrpcClient implements OnModuleInit {
  private weatherService: WeatherClient;

  constructor(@Inject(WEATHER_PACKAGE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.weatherService =
      this.client.getService<WeatherClient>('WeatherService');
  }

  async getWeather(data: CityRequest): Promise<Weather> {
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
