import { Weather } from '../../domain/weather.entity';
import { MetricsService } from '../metrics/metrics.service';
import { WeatherProvider } from '../../infrastructure/providers/weather-client.provider';

export class MetricsWeatherDecorator extends WeatherProvider {
  constructor(
    private readonly provider: WeatherProvider,
    private readonly metrics: MetricsService,
  ) {
    super();
  }

  async getWeather(city: string): Promise<Weather> {
    const result = await this.provider.handle(city);
    if (result) {
      this.metrics.incWeatherSuccess();
    } else {
      this.metrics.incWeatherError();
    }
    return result;
  }

  async validateCity(city: string): Promise<string> {
    return this.provider.checkCity(city);
  }
}
