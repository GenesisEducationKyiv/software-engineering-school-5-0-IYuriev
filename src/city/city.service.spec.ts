import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { ConfigService } from '@nestjs/config';
import { FetchService } from '../fetch/fetch.service';
import { NotFoundException } from '@nestjs/common';
import { ICityResponse } from '../constants/types/city.interface';

describe('CityService', () => {
  let service: CityService;

  const mockConfigService = {
    get: jest.fn(function (this: void, key: string) {
      const config: Record<string, string> = {
        API_KEY: 'test-api-key',
        WEATHER_API_URL: 'https://api.weather.com',
      };
      return config[key];
    }),
  };
  const mockFetchService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: FetchService,
          useValue: mockFetchService,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCity', () => {
    it('should return the city name if city is found', async () => {
      const city = 'Kyiv';
      const mockResponse: ICityResponse[] = [
        {
          id: 1,
          name: 'Kyiv',
          region: "Kyyivs'ka Oblast'",
          country: 'Ukraine',
          url: 'kyiv-ukraine',
          lat: 50.43,
          lon: 30.52,
        },
      ];

      mockFetchService.get.mockResolvedValue(mockResponse);

      const result = await service.validateCity(city);

      mockFetchService.get.mockResolvedValue(() => []);
      expect(result).toBe('Kyiv');
    });

    it('should throw NotFoundException if city is not found', async () => {
      mockFetchService.get.mockResolvedValue([]);

      await expect(service.validateCity('UnknownCity')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if API returns null', async () => {
      mockFetchService.get.mockResolvedValue(null);

      await expect(service.validateCity('NullCity')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
