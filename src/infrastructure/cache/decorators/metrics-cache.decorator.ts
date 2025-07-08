import { CacheTTL } from 'src/constants/enums/cache';
import { CacheService } from 'src/application/cache/cache.abstract';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';

export class MetricsCacheDecorator implements CacheService {
  constructor(
    private readonly cache: CacheService,
    private readonly metrics: MetricsService,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.cache.set(key, value, CacheTTL.FIVE_MINUTES);
    this.metrics.incCacheSet();
  }

  async get(key: string): Promise<string | null> {
    const result = await this.cache.get(key);
    if (result) {
      this.metrics.incCacheHit();
    } else {
      this.metrics.incCacheMiss();
    }
    return result;
  }
}
