import { Module } from '@nestjs/common';
import { MetricsModule } from './metrics.module';
import { RedisCacheService } from 'src/infrastructure/cache/cache.service';
import { CacheService } from 'src/application/cache/cache.abstract';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { MetricsCacheDecorator } from 'src/infrastructure/cache/decorators/metrics-cache.decorator';

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
