import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { CACHE_METRICS_NAMES } from 'src/constants/enums/metrics';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';

@Module({
  providers: [
    MetricsService,
    makeCounterProvider({
      name: CACHE_METRICS_NAMES.CACHE_HITS_TOTAL,
      help: CACHE_METRICS_NAMES.CACHE_HITS_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: CACHE_METRICS_NAMES.CACHE_MISSES_TOTAL,
      help: CACHE_METRICS_NAMES.CACHE_MISSES_TOTAL_HELP,
    }),
    makeCounterProvider({
      name: CACHE_METRICS_NAMES.CACHE_SET_TOTAL,
      help: CACHE_METRICS_NAMES.CACHE_SET_TOTAL_HELP,
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
