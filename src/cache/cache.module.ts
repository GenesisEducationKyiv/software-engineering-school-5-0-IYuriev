import { Module } from '@nestjs/common';
import { CacheService, RedisCacheService } from './cache.service';
import { MetricsCacheDecorator } from '../common/decorators/metrics-cache.decorator';
import { MetricsModule } from '../metrics/metrics.module';
import { MetricsService } from '../metrics/metrics.service';

@Module({
  imports: [MetricsModule],
  providers: [
    RedisCacheService,
    {
      provide: CacheService,
      useFactory: (redisCache: RedisCacheService, metrics: MetricsService) =>
        new MetricsCacheDecorator(redisCache, metrics),
      inject: [RedisCacheService, MetricsService],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
