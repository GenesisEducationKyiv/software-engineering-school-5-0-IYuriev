import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { CityValidatable } from '../../domain/weather.interface';
import { WeatherProvider } from '../../infrastructure/providers/weather-client.provider';
import { Weather } from '../../domain/weather.entity';
import { Inject } from '@nestjs/common';
import { WEATHER_MODULE_LOGGER } from '../../../../../libs/common/logger/logger.module';

export class LogWeatherClientDecorator extends WeatherProvider {
  constructor(
    private readonly provider: WeatherProvider & CityValidatable,
    @Inject(WEATHER_MODULE_LOGGER) private readonly logger: WinstonLogger,
    private readonly providerName: string,
  ) {
    super();
  }

  async getWeather(city: string): Promise<Weather> {
    const start = Date.now();
    const response = await this.provider.handle(city);
    this.logger.log(this.buildLogMessage(response), start);
    return response;
  }

  async validateCity(city: string): Promise<string> {
    return this.provider.validateCity(city);
  }

  private buildLogMessage(response: Weather): string {
    return `${this.providerName} - Response: ${JSON.stringify(response)}`;
  }
}
