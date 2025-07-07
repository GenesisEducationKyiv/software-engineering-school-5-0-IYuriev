import { WeatherResponse } from 'src/constants/types/weather';
import { CityValidatable } from 'src/core/weather/weather.interface';
import { WinstonLogger } from 'src/infrastructure/logger/logger.service';
import { WeatherProvider } from 'src/infrastructure/weather/weather-client.provider';

export class LogWeatherClientDecorator extends WeatherProvider {
  constructor(
    private readonly provider: WeatherProvider & CityValidatable,
    private readonly logger: WinstonLogger,
    private readonly providerName: string,
  ) {
    super();
  }

  async getWeather(city: string): Promise<WeatherResponse> {
    const response = await this.provider.handle(city);
    this.logger.log(this.buildLogMessage(response));
    return response;
  }

  async validateCity(city: string): Promise<string> {
    return this.provider.validateCity(city);
  }

  private buildLogMessage(response: WeatherResponse): string {
    return `${this.providerName} - Response: ${JSON.stringify(response)}`;
  }
}
