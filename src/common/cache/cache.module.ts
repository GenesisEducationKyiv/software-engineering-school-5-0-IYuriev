import { Module } from '@nestjs/common';
import { MetricsModule } from '../metrics/metrics.module';
import { RedisCacheService } from 'src/common/cache/infrastructure/cache.service';
import { CacheService } from 'src/common/cache/application/cache.interface';
import { MetricsService } from 'src/common/metrics/metrics.service';
import { MetricsCacheDecorator } from 'src/common/cache/infrastructure/decorators/metrics-cache.decorator';

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
