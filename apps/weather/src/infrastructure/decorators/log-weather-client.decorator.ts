import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { CityValidatable } from '../../domain/weather.interface';
import { WeatherProvider } from '../providers/weather-client.provider';
import { Weather } from '../../domain/weather.entity';

export class LogWeatherClientDecorator extends WeatherProvider {
  constructor(
    private readonly provider: WeatherProvider & CityValidatable,
    private readonly logger: WinstonLogger,
    private readonly providerName: string,
  ) {
    super();
  }

  async getWeather(city: string): Promise<Weather> {
    const response = await this.provider.handle(city);
    this.logger.log(this.buildLogMessage(response));
    return response;
  }

  async validateCity(city: string): Promise<string> {
    return this.provider.validateCity(city);
  }

  private buildLogMessage(response: Weather): string {
    return `${this.providerName} - Response: ${JSON.stringify(response)}`;
  }
}
