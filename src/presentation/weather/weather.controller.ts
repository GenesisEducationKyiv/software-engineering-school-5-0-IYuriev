import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { GetWeatherDto } from './dto/get-weather.dto';
import { WeatherApiClient } from 'src/weather/presentation/weather.client';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherApiClient) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto) {
    return await this.weatherService.getWeather(dto.city);
  }
}
