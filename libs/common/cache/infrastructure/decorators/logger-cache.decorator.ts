import { Injectable } from '@nestjs/common';
import { WinstonLogger } from '../../../logger/logger.service';
import { CacheService } from '../../application/cache.interface';

@Injectable()
export class LogCacheServiceDecorator implements CacheService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: WinstonLogger,
  ) {}

  async set(key: string, value: string): Promise<void> {
    const start = Date.now();
    await this.cacheService.set(key, value);
    this.logger.debug?.('Cache SET', start, { key, value });
  }

  async get(key: string): Promise<string | null> {
    const start = Date.now();
    const value = await this.cacheService.get(key);
    this.logger.debug?.('Cache GET', start, { key, value });
    return value;
  }
}
