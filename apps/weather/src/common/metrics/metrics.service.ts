import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { WEATHER_METRICS_NAMES } from '../../constants/enums/metrics';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(WEATHER_METRICS_NAMES.WEATHER_SUCCESS_TOTAL)
    private readonly weatherSuccessCounter: Counter<string>,
    @InjectMetric(WEATHER_METRICS_NAMES.WEATHER_ERROR_TOTAL)
    private readonly weatherErrorCounter: Counter<string>,
  ) {}

  incWeatherSuccess() {
    this.weatherSuccessCounter.inc();
  }

  incWeatherError() {
    this.weatherErrorCounter.inc();
  }
}
