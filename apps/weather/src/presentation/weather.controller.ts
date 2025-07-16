import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from '../application/weather.service';

@Controller('weather')
export class WeatherApiController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return this.weatherService.getWeather(city);
  }

  @Get('validate-city/:city')
  async validateCity(@Param('city') city: string) {
    return this.weatherService.validateCity(city);
  }
}
