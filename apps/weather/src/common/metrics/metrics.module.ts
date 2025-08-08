import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';
import { WEATHER_METRICS_NAMES } from '../../constants/enums/metrics';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/api/metrics',
      defaultLabels: { app: 'weather' },
      defaultMetrics: { enabled: false },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: WEATHER_METRICS_NAMES.WEATHER_SUCCESS_TOTAL,
      help: WEATHER_METRICS_NAMES.WEATHER_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: WEATHER_METRICS_NAMES.WEATHER_ERROR_TOTAL,
      help: WEATHER_METRICS_NAMES.WEATHER_ERROR_TOTAL_HELP,
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
