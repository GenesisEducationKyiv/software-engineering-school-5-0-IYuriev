import { Module } from '@nestjs/common';
import { MetricsModule } from '../metrics/metrics.module';
import { RedisCacheService } from './infrastructure/cache.service';
import { CacheService } from './application/cache.interface';
import { MetricsService } from '../metrics/metrics.service';
import { MetricsCacheDecorator } from './infrastructure/decorators/metrics-cache.decorator';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MetricsModule, ConfigModule],
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
