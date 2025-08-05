import { Weather } from '../../domain/weather.entity';
import { MetricsService } from '../metrics/metrics.service';
import { WeatherProvider } from '../../infrastructure/providers/weather-client.provider';
import { measureDuration } from '../metrics/measureDuration';

export class MetricsWeatherDecorator extends WeatherProvider {
  constructor(
    private readonly provider: WeatherProvider,
    private readonly metrics: MetricsService,
  ) {
    super();
  }

  async getWeather(city: string): Promise<Weather> {
    const { result, ms } = await measureDuration(() =>
      this.provider.handle(city),
    );
    this.metrics.observeWeatherDuration(ms, city, !!result);

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
