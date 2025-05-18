import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';
import { FetchService } from '../fetch/fetch.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { IWeatherData } from '../constants/types/weather.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let fetchService: FetchService;
  let getSpy: jest.SpyInstance;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'API_KEY') return 'test-api-key';
      if (key === 'WEATHER_API_URL')
        return 'http://api.weatherapi.com/v1/current.json';
      return null;
    }),
  };

  const mockWeatherData: IWeatherData = {
    location: {
      name: 'London',
      region: '',
      country: '',
      lat: 0,
      lon: 0,
      tz_id: '',
      localtime_epoch: 0,
      localtime: '',
    },
    current: {
      last_updated_epoch: 1234567890,
      last_updated: '2025-05-15 12:00',
      temp_c: 20,
      temp_f: 68,
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '',
        code: 1000,
      },
      wind_mph: 5,
      wind_kph: 8,
      wind_degree: 90,
      wind_dir: 'E',
      pressure_mb: 1015,
      pressure_in: 29.91,
      precip_mm: 0,
      precip_in: 0,
      humidity: 50,
      cloud: 0,
      feelslike_c: 20,
      feelslike_f: 68,
      vis_km: 10,
      vis_miles: 6,
      uv: 5,
      gust_mph: 7,
      gust_kph: 11,
      air_quality: {
        co: 0.5,
        no2: 0.1,
        o3: 0.3,
        so2: 0.05,
        pm2_5: 10,
        pm10: 20,
        'us-epa-index': 1,
        'gb-defra-index': 1,
      },
      windchill_c: 19,
      windchill_f: 66,
      heatindex_c: 21,
      heatindex_f: 69,
      dewpoint_c: 12,
      dewpoint_f: 54,
    },
  };

  const mockFetchService = {
    get: jest.fn(function (this: void) {
      return Promise.resolve(mockWeatherData);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: FetchService, useValue: mockFetchService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    fetchService = module.get<FetchService>(FetchService);

    getSpy = jest.spyOn(fetchService, 'get');
  });

  it('should call FetchService with correct URL and return weather data', async () => {
    const dto: GetWeatherDto = { city: 'London' };

    const result = await service.getWeather(dto);

    expect(getSpy).toHaveBeenCalledWith(
      'http://api.weatherapi.com/v1/current.json?key=test-api-key&q=London&aqi=yes',
    );

    expect(result).toEqual({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    });
  });
});
