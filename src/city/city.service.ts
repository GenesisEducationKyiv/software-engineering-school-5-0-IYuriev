import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICityService } from './interfaces/city-service.interface';
import { WeatherClientService } from 'src/weather-client/weather-client.service';
import { WeatherClientServiceToken } from 'src/weather-client/interfaces/weather-service.interface';

@Injectable()
export class CityService implements ICityService {
  constructor(
    @Inject(WeatherClientServiceToken)
    private readonly weatherClient: WeatherClientService,
  ) {}

  async validateCity(city: string): Promise<string> {
    const validCity = await this.weatherClient.searchCity(city);
    if (!validCity?.length) throw new NotFoundException('City not found');
    return validCity[0].name;
  }
}
