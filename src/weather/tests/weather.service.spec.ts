import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import {
  WeatherClient,
  WeatherClientToken,
} from '../interfaces/weather-service.interface';
import { WeatherResponse } from '../../constants/types/weather';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockWeatherClient: jest.Mocked<WeatherClient>;

  beforeEach(async () => {
    mockWeatherClient = {
      getWeather: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherClientToken,
          useValue: mockWeatherClient,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate getWeather to WeatherClient', async () => {
    const city = 'Kyiv';
    const mockResponse: WeatherResponse = {
      temperature: 20,
      humidity: 60,
      description: 'Sunny',
    };
    mockWeatherClient.getWeather.mockResolvedValueOnce(mockResponse);

    const result = await service.getWeather(city);

    expect(mockWeatherClient.getWeather.mock.calls[0][0]).toBe(city);
    expect(result).toEqual(mockResponse);
  });

  it('should throw if WeatherClient throws', async () => {
    mockWeatherClient.getWeather.mockRejectedValue(new Error('API error'));

    await expect(service.getWeather('London')).rejects.toThrow('API error');
  });

  it('should call getWeather with different cities', async () => {
    const cities = ['Paris', 'Berlin', 'Tokyo'];
    const responses: WeatherResponse[] = [
      { temperature: 18, humidity: 55, description: 'Cloudy' },
      { temperature: 22, humidity: 50, description: 'Clear' },
      { temperature: 25, humidity: 70, description: 'Rainy' },
    ];

    for (let i = 0; i < cities.length; i++) {
      mockWeatherClient.getWeather.mockResolvedValueOnce(responses[i]);
      const result = await service.getWeather(cities[i]);
      expect(
        mockWeatherClient.getWeather.mock.calls[
          mockWeatherClient.getWeather.mock.calls.length - 1
        ][0],
      ).toBe(cities[i]);
      expect(result).toEqual(responses[i]);
    }
  });

  it('should handle empty city string', async () => {
    const mockResponse: WeatherResponse = {
      temperature: 0,
      humidity: 0,
      description: 'Unknown',
    };
    mockWeatherClient.getWeather.mockResolvedValueOnce(mockResponse);

    const result = await service.getWeather('');
    expect(mockWeatherClient.getWeather.mock.calls[0][0]).toBe('');
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from WeatherClient', async () => {
    const error = new Error('Network error');
    mockWeatherClient.getWeather.mockRejectedValueOnce(error);

    await expect(service.getWeather('Madrid')).rejects.toThrow('Network error');
  });
});
