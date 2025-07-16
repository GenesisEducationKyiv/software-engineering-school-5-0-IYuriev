import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../../apps/gateway/src/presentation/subscription/dto/create-subscription.dto';
import { GetWeatherDto } from '../../../apps/gateway/src/presentation/weather/dto/get-weather.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  async transform(value: CreateSubscriptionDto | GetWeatherDto) {
    const url = `http://weather:4001/weather/validate-city/${encodeURIComponent(value.city)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new NotFoundException('City not found');
    }
    const city = await res.text();
    return { ...value, city };
  }
}
