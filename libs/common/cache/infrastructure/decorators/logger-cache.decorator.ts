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
    this.logger.debug?.(`SET key=${key}`, start);
  }

  async get(key: string): Promise<string | null> {
    const start = Date.now();
    const result = await this.cacheService.get(key);
    this.logger.debug?.(`GET key=${key} result=${result}`, start);
    return result;
  }
}
