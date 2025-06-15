export interface ICacheService {
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
}
export const CacheServiceToken = Symbol('CacheService');
