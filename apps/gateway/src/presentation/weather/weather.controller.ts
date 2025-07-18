import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { GetWeatherDto } from './dto/get-weather.dto';
import {
  Weather,
  WeatherGrpcClient,
} from '../../infrastructure/clients/weather.client';
import { CityValidationPipe } from '../../common/pipes/city.validation.pipe';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherGrpcClient) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto): Promise<Weather> {
    return await this.weatherService.getWeather(dto);
  }
}
