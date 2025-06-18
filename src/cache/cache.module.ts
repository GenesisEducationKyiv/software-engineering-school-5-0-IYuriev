import { Module } from '@nestjs/common';

import { CacheService, RedisCacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: CacheService,
      useClass: RedisCacheService,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
