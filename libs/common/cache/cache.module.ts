import { Module } from '@nestjs/common';
import { MetricsModule } from './infrastructure/metrics/metrics.module';
import { RedisCacheService } from './infrastructure/cache.service';
import { CacheService } from './application/cache.interface';
import { MetricsService } from './infrastructure/metrics/metrics.service';
import { MetricsCacheDecorator } from './infrastructure/decorators/metrics-cache.decorator';
import { ConfigModule } from '@nestjs/config';
import { WinstonLogger } from '../logger/logger.service';
import { LogCacheServiceDecorator } from './infrastructure/decorators/logger-cache.decorator';
import { CACHE_SERVICE_LOGGER } from '../logger/logger.module';

@Module({
  imports: [MetricsModule, ConfigModule],
  providers: [
    RedisCacheService,
    {
      provide: CacheService,
      useFactory: (
        redisCache: RedisCacheService,
        metrics: MetricsService,
        logger: WinstonLogger,
      ) => {
        const metricsDecorator = new MetricsCacheDecorator(redisCache, metrics);
        return new LogCacheServiceDecorator(metricsDecorator, logger);
      },
      inject: [RedisCacheService, MetricsService, CACHE_SERVICE_LOGGER],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
