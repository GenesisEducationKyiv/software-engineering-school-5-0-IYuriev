import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WeatherService } from '../application/weather.service';
import {
  CityRequest,
  GetWeatherResponse,
  ValidateCityResponse,
} from '../../../../libs/proto/generated/weather';

@Controller()
export class WeatherApiController {
  constructor(private readonly weatherService: WeatherService) {}

  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather(data: CityRequest): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(data.city);
  }

  @GrpcMethod('WeatherService', 'ValidateCity')
  async validateCity(data: CityRequest): Promise<ValidateCityResponse> {
    const city = await this.weatherService.validateCity(data.city);
    return { city };
  }
}
