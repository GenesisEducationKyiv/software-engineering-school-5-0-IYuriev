import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiEndpoint } from 'src/constants/enums/weather';
import { ICityResponse } from 'src/constants/types/city.interface';
import { FetchService } from 'src/fetch/fetch.service';

@Injectable()
export class CityService {
  private readonly API_KEY: string;
  private readonly WEATHER_API_URL: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    this.API_KEY = this.config.get<string>('API_KEY', '');
    this.WEATHER_API_URL = this.config.get<string>('WEATHER_API_URL', '');
  }

  async validateCity(city: string): Promise<string> {
    const url = `${this.WEATHER_API_URL}${WeatherApiEndpoint.SEARCH}?key=${this.API_KEY}&q=${city}`;
    const validCity = await this.fetch.get<ICityResponse[]>(url);
    if (!validCity?.length) throw new NotFoundException('City not found');
    return validCity[0].name;
  }
}
