import { PipeTransform, Injectable } from '@nestjs/common';
import { WeatherGrpcClient } from '../clients/weather.client';
import { CreateSubscriptionDto } from '../../presentation/subscription/dto/create-subscription.dto';
import { GetWeatherDto } from '../../presentation/weather/dto/get-weather.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly weatherGrpcClient: WeatherGrpcClient) {}

  async transform(value: CreateSubscriptionDto | GetWeatherDto) {
    const response = await this.weatherGrpcClient.validateCity({
      city: value.city,
    });
    if (!response.city) {
      throw new RpcException({ code: 5, message: 'City not found' });
    }
    return { ...value, city: response.city };
  }
}
