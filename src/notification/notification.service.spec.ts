import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WeatherService } from '../weather/weather.service';
import { ConfigService } from '@nestjs/config';
import { NotificationFrequency } from '../constants/enums/subscription';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;
  let email: EmailService;
  let weather: WeatherService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            subscription: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendForecastEmail: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'UNSUBSCRIBE_URL') return 'http://unsubscribe.test';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
    email = module.get<EmailService>(EmailService);
    weather = module.get<WeatherService>(WeatherService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(email).toBeDefined();
    expect(weather).toBeDefined();
    expect(config).toBeDefined();
  });

  it('should call notifySubscribers with HOURLY frequency', async () => {
    const spy = jest
      .spyOn<any, any>(service as any, 'notifySubscribers')
      .mockResolvedValue(undefined);
    await service.notifyHourly();
    expect(spy).toHaveBeenCalledWith(NotificationFrequency.HOURLY);
    spy.mockRestore();
  });

  it('should call notifySubscribers with DAILY frequency', async () => {
    const spy = jest
      .spyOn<any, any>(service as any, 'notifySubscribers')
      .mockResolvedValue(undefined);
    await service.notifyDaily();
    expect(spy).toHaveBeenCalledWith(NotificationFrequency.DAILY);
    spy.mockRestore();
  });

  it('should do nothing if no subscriptions found', async () => {
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue([]);
    const result = await service['notifySubscribers'](
      NotificationFrequency.HOURLY,
    );
    expect(result).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.subscription.findMany).toHaveBeenCalled();
  });
});
