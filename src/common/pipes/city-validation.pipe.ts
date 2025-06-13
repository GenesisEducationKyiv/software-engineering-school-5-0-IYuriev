import { PipeTransform, Injectable } from '@nestjs/common';
import { CityService } from '../../city/city.service';
import { CreateSubscriptionDto } from 'src/subscription/dto/create-subscription.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly cityService: CityService) {}

  async transform(value: CreateSubscriptionDto) {
    const validCity = await this.cityService.validateCity(value.city);
    return { ...value, city: validCity };
  }
}
