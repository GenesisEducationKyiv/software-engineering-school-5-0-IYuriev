import { Module } from '@nestjs/common';
import { CacheServiceToken } from './interfaces/cache-service.inteface';
import { RedisCacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: CacheServiceToken,
      useClass: RedisCacheService,
    },
    RedisCacheService,
  ],
  exports: [CacheServiceToken],
})
export class CacheModule {}
