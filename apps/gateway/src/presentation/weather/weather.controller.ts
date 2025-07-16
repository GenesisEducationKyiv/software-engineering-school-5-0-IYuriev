import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from '../../../../../libs/common/pipes/city-validation.pipe';
import { GetWeatherDto } from './dto/get-weather.dto';
import { WeatherHttpClient } from '../../infrastructure/clients/weather-http.client';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherHttpClient) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto) {
    return await this.weatherService.getWeather(dto.city);
  }
}
