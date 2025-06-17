import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICacheService } from '../cache/interfaces/cache-service.interface';
import { CacheTTL } from '../constants/enums/cache';

@Injectable()
export class RedisCacheService implements OnModuleDestroy, ICacheService {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) throw new Error('Failed to connect to Redis');
    this.client = new Redis(redisUrl);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value, 'EX', CacheTTL.FIVE_MINUTES);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
