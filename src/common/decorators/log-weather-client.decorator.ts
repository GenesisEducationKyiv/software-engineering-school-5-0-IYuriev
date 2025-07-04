import { WeatherResponse } from '../../constants/types/weather';
import { WinstonLogger } from '../../infrastructure/logger/logger.service';
import { CityValidatable } from '../../core/weather/weather.interface';
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
