import { Test, TestingModule } from '@nestjs/testing';
import { FetchService } from './fetch.service';
import { WinstonLogger } from '../logger/logger.service';
import { HttpException } from '@nestjs/common';

global.fetch = jest.fn();

describe('FetchService', () => {
  let service: FetchService;
  let logger: WinstonLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchService,
        {
          provide: WinstonLogger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FetchService>(FetchService);
    logger = module.get<WinstonLogger>(WinstonLogger);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return JSON on successful fetch', async () => {
    const mockData = { foo: 'bar' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => mockData,
    });

    const result = await service.get<{ foo: string }>('https://example.com');

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://example.com');
  });

  it('should log error and throw HttpException on failed fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(service.get('https://example.com')).rejects.toThrow(
      new HttpException('404 Not Found', 404),
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Fetch error from https://example.com: 404 Not Found',
    );
  });
});
