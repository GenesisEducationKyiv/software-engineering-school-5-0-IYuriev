import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('CacheService', () => {
  let service: CacheService;

  const redisClientMock = {
    set: jest.fn(),
    get: jest.fn(),
    quit: jest.fn(),
  };

  beforeEach(async () => {
    (Redis as unknown as jest.Mock).mockImplementation(() => redisClientMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('redis://localhost:6379'),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('should set a value with default TTL', async () => {
      await service.set('key1', 'value1');
      expect(redisClientMock.set).toHaveBeenCalledWith(
        'key1',
        'value1',
        'EX',
        300,
      );
    });

    it('should set a value with custom TTL', async () => {
      await service.set('key2', 'value2', 100);
      expect(redisClientMock.set).toHaveBeenCalledWith(
        'key2',
        'value2',
        'EX',
        100,
      );
    });
  });

  describe('get', () => {
    it('should get a value from redis', async () => {
      redisClientMock.get.mockResolvedValue('cachedValue');
      const result = await service.get('key1');
      expect(result).toBe('cachedValue');
    });

    it('should return null if key is not found', async () => {
      redisClientMock.get.mockResolvedValue(null);
      const result = await service.get('missingKey');
      expect(result).toBeNull();
    });
  });

  describe('onModuleDestroy', () => {
    it('should gracefully close redis connection', async () => {
      await service.onModuleDestroy();
      expect(redisClientMock.quit).toHaveBeenCalled();
    });
  });

  describe('constructor', () => {
    it('should throw if REDIS_URL is not defined', () => {
      const badConfig = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ConfigService;

      expect(() => new CacheService(badConfig)).toThrow(
        'Failed to connect to Redis',
      );
    });
  });
});
