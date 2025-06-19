import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { FetchService } from '../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { CityService } from '../city/city.service';
import { WeatherData } from '../constants/types/weather';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockFetchService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'API_KEY') return 'test-api-key';
      if (key === 'WEATHER_API_URL') return 'https://api.weatherapi.com/v1/';
      return '';
    }),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockCityService = {
    validateCity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: FetchService, useValue: mockFetchService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: CityService, useValue: mockCityService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    const dto = { city: 'Kyiv' };
    const validatedCity = 'Kyiv';
    const cacheKey = `weather:${validatedCity}`;

    const mockApiResponse: WeatherData = {
      current: {
        last_updated_epoch: 0,
        last_updated: '',
        temp_c: 18,
        temp_f: 64.4,
        is_day: 1,
        condition: {
          text: 'Sunny',
          icon: '',
          code: 1000,
        },
        wind_mph: 0,
        wind_kph: 0,
        wind_degree: 0,
        wind_dir: '',
        pressure_mb: 0,
        pressure_in: 0,
        precip_mm: 0,
        precip_in: 0,
        humidity: 55,
        cloud: 0,
        feelslike_c: 18,
        feelslike_f: 64.4,
        vis_km: 0,
        vis_miles: 0,
        uv: 0,
        gust_mph: 0,
        gust_kph: 0,
        air_quality: {
          co: 0,
          no2: 0,
          o3: 0,
          so2: 0,
          pm2_5: 0,
          pm10: 0,
          'us-epa-index': 0,
          'gb-defra-index': 0,
        },
        windchill_c: 18,
        windchill_f: 64.4,
        heatindex_c: 18,
        heatindex_f: 64.4,
        dewpoint_c: 10,
        dewpoint_f: 50,
      },
      location: {
        name: 'Kyiv',
        region: '',
        country: '',
        lat: 0,
        lon: 0,
        tz_id: '',
        localtime_epoch: 0,
        localtime: '',
      },
    };

    const expectedResponse = {
      temperature: 18,
      humidity: 55,
      description: 'Sunny',
    };

    it('should return cached weather data if available', async () => {
      mockCityService.validateCity.mockResolvedValue(validatedCity);
      mockCacheService.get.mockResolvedValue(JSON.stringify(expectedResponse));

      const result = await service.getWeather(dto.city);

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(expectedResponse);
      expect(mockFetchService.get).not.toHaveBeenCalled();
    });

    it('should fetch, cache, and return data if not cached', async () => {
      mockCityService.validateCity.mockResolvedValue(validatedCity);
      mockCacheService.get.mockResolvedValue(null);
      mockFetchService.get.mockResolvedValue(mockApiResponse);

      const result = await service.getWeather(dto.city);

      const expectedUrl = `https://api.weatherapi.com/v1/current.json?key=test-api-key&q=Kyiv&aqi=yes`;

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockFetchService.get).toHaveBeenCalledWith(expectedUrl);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(expectedResponse),
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
