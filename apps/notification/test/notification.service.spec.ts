import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepositoryToken } from 'src/notification/application/interfaces/notification-repository.interface';
import { SubscriptionClient } from 'src/subscription/presentation/subscription.client';
import { NotificationService } from 'src/notification/application/use-case/notification.service';
import { Frequency } from 'src/subscription/domain/subscription/subscription.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationRepo: { send: jest.Mock };
  let mockSubscriptionClient: { confirmed: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionClient = {
      confirmed: jest.fn(),
    };
    mockNotificationRepo = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SubscriptionClient,
          useValue: mockSubscriptionClient,
        },
        {
          provide: NotificationRepositoryToken,
          useValue: mockNotificationRepo,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getConfirmedSubscriptions and send for each subscription', async () => {
    const fakeSubs = [{ id: 1 }, { id: 2 }];
    mockSubscriptionClient.confirmed.mockResolvedValue(fakeSubs);

    await service['notifySubscribers'](Frequency.DAILY);

    expect(mockSubscriptionClient.confirmed).toHaveBeenCalledWith(
      Frequency.DAILY,
    );
    expect(mockNotificationRepo.send).toHaveBeenCalledTimes(fakeSubs.length);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[0]);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[1]);
  });

  it('should handle empty subscriptions gracefully', async () => {
    mockSubscriptionClient.confirmed.mockResolvedValue([]);

    await expect(
      service['notifySubscribers'](Frequency.HOURLY),
    ).resolves.not.toThrow();
    expect(mockNotificationRepo.send).not.toHaveBeenCalled();
  });

  it('should propagate errors from notificationRepo.send', async () => {
    mockSubscriptionClient.confirmed.mockResolvedValue([{ id: 1 }]);
    mockNotificationRepo.send.mockRejectedValueOnce(new Error('fail'));

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
