import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';
import {
  WEATHER_METRICS_NAMES,
  WEATHER_REQUEST_DURATION,
} from '../../constants/enums/metrics';

@Injectable()
export class MetricsService {
  private weatherDuration = new Gauge(WEATHER_REQUEST_DURATION);
  constructor(
    @InjectMetric(WEATHER_METRICS_NAMES.WEATHER_SUCCESS_TOTAL)
    private readonly weatherSuccessCounter: Counter<string>,
    @InjectMetric(WEATHER_METRICS_NAMES.WEATHER_ERROR_TOTAL)
    private readonly weatherErrorCounter: Counter<string>,
  ) {}

  observeWeatherDuration(ms: number, city: string, success: boolean) {
    this.weatherDuration.set({ city, success: String(success) }, ms);
  }

  incWeatherSuccess() {
    this.weatherSuccessCounter.inc();
  }

  incWeatherError() {
    this.weatherErrorCounter.inc();
  }
}
