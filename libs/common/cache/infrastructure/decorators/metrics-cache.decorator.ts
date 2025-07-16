import { MetricsService } from '../../../../../libs/common/metrics/metrics.service';
import { CacheService } from '../../application/cache.interface';
import { CacheTTL } from '../../../../../libs/constants/enums/cache';

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
