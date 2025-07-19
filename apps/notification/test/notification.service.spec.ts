import { Test, TestingModule } from '@nestjs/testing';
import {
  Frequency,
  NotificationService,
} from '../src/application/use-case/notification.service';
import { NotificationSenderToken } from '../src/application/interfaces/notification-repository.interface';
import { SubscriptionGrpcClient } from '../src/infrastructure/clients/subscription.client';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationRepo: { send: jest.Mock };
  let mockSubscriptionClient: { getConfirmedSubscriptions: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionClient = { getConfirmedSubscriptions: jest.fn() };
    mockNotificationRepo = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SubscriptionGrpcClient,
          useValue: mockSubscriptionClient,
        },
        {
          provide: NotificationSenderToken,
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
    mockSubscriptionClient.getConfirmedSubscriptions.mockResolvedValue(
      fakeSubs,
    );

    await service['notifySubscribers'](Frequency.DAILY);

    expect(mockSubscriptionClient.getConfirmedSubscriptions).toHaveBeenCalled();
    expect(mockNotificationRepo.send).toHaveBeenCalledTimes(fakeSubs.length);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[0]);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[1]);
  });

  it('should handle empty subscriptions gracefully', async () => {
    mockSubscriptionClient.getConfirmedSubscriptions.mockResolvedValue([]);

    await expect(
      service['notifySubscribers'](Frequency.HOURLY),
    ).resolves.not.toThrow();
    expect(mockNotificationRepo.send).not.toHaveBeenCalled();
  });

  it('should propagate errors from notificationRepo.send', async () => {
    mockSubscriptionClient.getConfirmedSubscriptions.mockResolvedValue([
      { id: 1 },
    ]);
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
