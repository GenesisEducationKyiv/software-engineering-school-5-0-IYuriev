import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../subscription/dto/create-subscription.dto';
import {
  WeatherClient,
  WeatherClientToken,
} from '../../weather-client/interfaces/weather-service.interface';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(
    @Inject(WeatherClientToken)
    private readonly weatherClient: WeatherClient,
  ) {}

  async transform(value: CreateSubscriptionDto) {
    const validCity =
      (await this.weatherClient.validateCity?.(value.city)) || value.city;
    return { ...value, city: validCity };
  }
}
