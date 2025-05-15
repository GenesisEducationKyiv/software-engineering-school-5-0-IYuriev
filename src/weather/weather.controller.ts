import { Body, Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Body() dto: GetWeatherDto) {
    return await this.weatherService.getWeather(dto);
  }
}
