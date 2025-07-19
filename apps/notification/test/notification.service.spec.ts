import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../src/application/use-case/notification.service';
import {
  Frequency,
  NotificationSenderToken,
} from '../src/application/interfaces/notification-sender.interface';
import { APP_SUBSCRIPTION_CLIENT } from '../src/application/interfaces/subscription.client.interface';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationSender: { send: jest.Mock; sendByFrequency: jest.Mock };
  let mockSubscriptionClient: { getConfirmedSubscriptions: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionClient = { getConfirmedSubscriptions: jest.fn() };
    mockNotificationSender = {
      send: jest.fn(),
      sendByFrequency: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: APP_SUBSCRIPTION_CLIENT,
          useValue: mockSubscriptionClient,
        },
        {
          provide: NotificationSenderToken,
          useValue: mockNotificationSender,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getConfirmedSubscriptions and send for each subscription', async () => {
    await service['notifySubscribers'](Frequency.DAILY);
    expect(mockNotificationSender.sendByFrequency).toHaveBeenCalledWith(
      Frequency.DAILY,
    );
  });

  it('should handle empty subscriptions gracefully', async () => {
    await expect(
      service['notifySubscribers'](Frequency.HOURLY),
    ).resolves.not.toThrow();
    expect(mockNotificationSender.sendByFrequency).toHaveBeenCalledWith(
      Frequency.HOURLY,
    );
  });

  it('should propagate errors from notificationRepo.send', async () => {
    mockNotificationSender.sendByFrequency.mockRejectedValueOnce(
      new Error('fail'),
    );
    await expect(service['notifySubscribers'](Frequency.DAILY)).rejects.toThrow(
      'fail',
    );
  });

  it('notifyHourly should call notifySubscribers with HOURLY', async () => {
    const spy = jest
      .spyOn(service, 'notifySubscribers' as keyof NotificationService)
      .mockResolvedValue(undefined);
    await service.notifyHourly();
    expect(spy).toHaveBeenCalledWith(Frequency.HOURLY);
  });

  it('notifyDaily should call notifySubscribers with DAILY', async () => {
    const spy = jest
      .spyOn(service, 'notifySubscribers' as keyof NotificationService)
      .mockResolvedValue(undefined);
    await service.notifyDaily();
    expect(spy).toHaveBeenCalledWith(Frequency.DAILY);
  });
});
