import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly client: Redis;
  private DEFAULT_TTL = 300;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) throw new Error('Failed to connect to Redis');
    this.client = new Redis(redisUrl);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value, 'EX', this.DEFAULT_TTL);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
