import { Injectable, NotFoundException } from '@nestjs/common';
import { ICityService } from './interfaces/city-service.interface';
import { WeatherClientService } from 'src/weather-client/weather-client.service';

@Injectable()
export class CityService implements ICityService {
  constructor(private readonly weatherClient: WeatherClientService) {}

  async validateCity(city: string): Promise<string> {
    const validCity = await this.weatherClient.searchCity(city);
    if (!validCity?.length) throw new NotFoundException('City not found');
    return validCity[0].name;
  }
}
