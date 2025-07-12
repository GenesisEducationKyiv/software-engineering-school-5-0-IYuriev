import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../presentation/subscription/dto/create-subscription.dto';
import { CityValidatable } from 'src/weather/domain/weather.interface';
import { WeatherClientToken } from 'src/weather/domain/weather.interface';
import { GetWeatherDto } from 'src/presentation/weather/dto/get-weather.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(
    @Inject(WeatherClientToken)
    private readonly weatherClient: CityValidatable,
  ) {}

  async transform(value: CreateSubscriptionDto | GetWeatherDto) {
    const validCity = await this.weatherClient.validateCity(value.city);
    return { ...value, city: validCity };
  }
}
