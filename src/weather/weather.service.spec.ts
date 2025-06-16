import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { CacheServiceToken } from '../cache/interfaces/cache-service.interface';
import { WeatherClientServiceToken } from '../weather-client/interfaces/weather-service.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockCacheService: { get: jest.Mock; set: jest.Mock };
  let mockWeatherClientService: { fetchWeather: jest.Mock };

  const city = 'Kyiv';
  const cacheKey = `weather:${city}`;
  const weatherData = {
    temperature: 22,
    humidity: 60,
    description: 'Sunny',
  };

  beforeEach(async () => {
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };
    mockWeatherClientService = {
      fetchWeather: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: CacheServiceToken, useValue: mockCacheService },
        {
          provide: WeatherClientServiceToken,
          useValue: mockWeatherClientService,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    it('should return weather from cache if available', async () => {
      mockCacheService.get.mockResolvedValue(JSON.stringify(weatherData));

      const result = await service.getWeather(city);

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(weatherData);
      expect(mockWeatherClientService.fetchWeather).not.toHaveBeenCalled();
    });

    it('should fetch weather, cache it, and return if not in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockWeatherClientService.fetchWeather.mockResolvedValue({
        current: {
          temp_c: weatherData.temperature,
          humidity: weatherData.humidity,
          condition: { text: weatherData.description },
        },
      });

      const result = await service.getWeather(city);

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockWeatherClientService.fetchWeather).toHaveBeenCalledWith(city);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(weatherData),
      );
      expect(result).toEqual(weatherData);
    });

    it('should propagate errors from cache service', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Redis error'));

      await expect(service.getWeather(city)).rejects.toThrow('Redis error');
    });

    it('should propagate errors from fetch service', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockWeatherClientService.fetchWeather.mockRejectedValue(
        new Error('Fetch error'),
      );

      await expect(service.getWeather(city)).rejects.toThrow('Fetch error');
    });
  });
});
