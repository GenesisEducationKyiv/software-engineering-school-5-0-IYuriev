import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { CACHE_METRICS_NAMES } from '../../../libs/constants/enums/metrics';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(CACHE_METRICS_NAMES.CACHE_HITS_TOTAL)
    private readonly cacheHitCounter: Counter<string>,
    @InjectMetric(CACHE_METRICS_NAMES.CACHE_MISSES_TOTAL)
    private readonly cacheMissCounter: Counter<string>,
    @InjectMetric(CACHE_METRICS_NAMES.CACHE_SET_TOTAL)
    private readonly cacheSetCounter: Counter<string>,
  ) {}

  incCacheHit() {
    this.cacheHitCounter.inc();
  }

  incCacheMiss() {
    this.cacheMissCounter.inc();
  }

  incCacheSet() {
    this.cacheSetCounter.inc();
  }
}
