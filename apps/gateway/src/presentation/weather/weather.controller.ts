import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { GetWeatherDto } from './dto/get-weather.dto';
import { Weather } from '../../infrastructure/clients/weather.client';
import { CityValidationPipe } from '../../common/pipes/city.validation.pipe';
import { AppWeatherClient } from '../../application/weather.client.interface';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: AppWeatherClient) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto): Promise<Weather> {
    return await this.weatherService.getWeather(dto);
  }
}
