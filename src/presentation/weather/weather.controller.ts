import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { WeatherService } from 'src/application/weather/use-cases/weather.service';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() dto: GetWeatherDto) {
    return await this.weatherService.getWeather(dto.city);
  }
}
