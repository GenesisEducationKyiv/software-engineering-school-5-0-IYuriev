import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WeatherService } from '../weather/weather.service';
import { ConfigService } from '@nestjs/config';
import { NotificationFrequency } from '../constants/enums/subscription';

const mockPrismaService = {
  subscription: {
    findMany: jest.fn(),
  },
};

const mockEmailService = {
  sendForecastEmail: jest.fn(),
};

const mockWeatherService = {
  getWeather: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);

    mockConfigService.get.mockReturnValue('https://example.com/unsubscribe');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('notifySubscribers', () => {
    it('should notify all confirmed subscribers for a given frequency', async () => {
      mockPrismaService.subscription.findMany.mockResolvedValue([
        {
          email: 'test@example.com',
          city: 'Kyiv',
          tokens: [{ token: 'abc123' }],
        },
      ]);

      mockWeatherService.getWeather.mockResolvedValue({
        temp: 25,
        condition: 'Clear',
      });

      await service['notifySubscribers'](NotificationFrequency.DAILY);

      expect(mockPrismaService.subscription.findMany).toHaveBeenCalledWith({
        where: { confirmed: true, frequency: NotificationFrequency.DAILY },
        include: { tokens: true },
      });

      expect(mockWeatherService.getWeather).toHaveBeenCalledWith('Kyiv');

      expect(mockEmailService.sendForecastEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Kyiv',
        expect.stringContaining('Kyiv'),
      );
    });

    it('should not throw if no subscribers found', async () => {
      mockPrismaService.subscription.findMany.mockResolvedValue([]);

      await expect(
        service['notifySubscribers'](NotificationFrequency.HOURLY),
      ).resolves.not.toThrow();

      expect(mockEmailService.sendForecastEmail).not.toHaveBeenCalled();
    });
  });

  describe('notifyHourly', () => {
    it('should call notifySubscribers with HOURLY', async () => {
      const spy = jest
        .spyOn(service as any, 'notifySubscribers')
        .mockImplementation();
      await service.notifyHourly();
      expect(spy).toHaveBeenCalledWith(NotificationFrequency.HOURLY);
    });
  });

  describe('notifyDaily', () => {
    it('should call notifySubscribers with DAILY', async () => {
      const spy = jest
        .spyOn(service as any, 'notifySubscribers')
        .mockImplementation();
      await service.notifyDaily();
      expect(spy).toHaveBeenCalledWith(NotificationFrequency.DAILY);
    });
  });
});
