import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MetricsService, EMAIL_METRICS_NAMES } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/api/metrics',
      defaultLabels: { app: 'email' },
      defaultMetrics: { enabled: false },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: EMAIL_METRICS_NAMES.CONFIRMATION_SUCCESS_TOTAL,
      help: EMAIL_METRICS_NAMES.CONFIRMATION_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: EMAIL_METRICS_NAMES.CONFIRMATION_ERROR_TOTAL,
      help: EMAIL_METRICS_NAMES.CONFIRMATION_ERROR_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: EMAIL_METRICS_NAMES.FORECAST_SUCCESS_TOTAL,
      help: EMAIL_METRICS_NAMES.FORECAST_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: EMAIL_METRICS_NAMES.FORECAST_ERROR_TOTAL,
      help: EMAIL_METRICS_NAMES.FORECAST_ERROR_TOTAL_HELP,
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
