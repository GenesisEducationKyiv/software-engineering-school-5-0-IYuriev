import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { WeatherService } from '../application/weather/use-cases/weather.service';
import { GetWeatherDto } from '../application/weather/dto/get-weather.dto';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto) {
    return await this.weatherService.getWeather(dto.city);
  }
}
