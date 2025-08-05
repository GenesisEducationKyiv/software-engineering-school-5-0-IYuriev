import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MetricsService, SUBSCRIPTION_METRICS_NAMES } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/api/metrics',
      defaultLabels: { app: 'subscription' },
      defaultMetrics: { enabled: false },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_SUCCESS_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_ERROR_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.SUBSCRIBE_ERROR_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.CONFIRM_SUCCESS_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.CONFIRM_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.CONFIRM_ERROR_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.CONFIRM_ERROR_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_SUCCESS_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_SUCCESS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_ERROR_TOTAL,
      help: SUBSCRIPTION_METRICS_NAMES.UNSUBSCRIBE_ERROR_TOTAL_HELP,
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
