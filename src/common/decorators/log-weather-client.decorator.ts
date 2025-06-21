import { WeatherProvider } from '../../weather-client/weather-client.provider';
import { WeatherResponse } from '../../constants/types/weather';
import { WinstonLogger } from '../../infrastructure/logger/logger.service';
import { CityValidatable } from '../../weather/interfaces/weather-service.interface';

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
