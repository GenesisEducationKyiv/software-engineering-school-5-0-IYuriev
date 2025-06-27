import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { NotificationFrequency } from '../../constants/enums/subscription';
import { SubscriptionRepositoryToken } from '../../subscription/interfaces/subscription-repoository.interface';
import { NotificationRepositoryToken } from '../interfaces/notification-repository.interface';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSubscriptionRepo: { getConfirmedSubscriptions: jest.Mock };
  let mockNotificationRepo: { send: jest.Mock };

  beforeEach(async () => {
    mockSubscriptionRepo = {
      getConfirmedSubscriptions: jest.fn(),
    };
    mockNotificationRepo = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SubscriptionRepositoryToken,
          useValue: mockSubscriptionRepo,
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
    mockSubscriptionRepo.getConfirmedSubscriptions.mockResolvedValue(fakeSubs);

    await service['notifySubscribers'](NotificationFrequency.DAILY);

    expect(mockSubscriptionRepo.getConfirmedSubscriptions).toHaveBeenCalledWith(
      NotificationFrequency.DAILY,
    );
    expect(mockNotificationRepo.send).toHaveBeenCalledTimes(fakeSubs.length);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[0]);
    expect(mockNotificationRepo.send).toHaveBeenCalledWith(fakeSubs[1]);
  });

  it('should handle empty subscriptions gracefully', async () => {
    mockSubscriptionRepo.getConfirmedSubscriptions.mockResolvedValue([]);

    await expect(
      service['notifySubscribers'](NotificationFrequency.HOURLY),
    ).resolves.not.toThrow();
    expect(mockNotificationRepo.send).not.toHaveBeenCalled();
  });

  it('should propagate errors from notificationRepo.send', async () => {
    mockSubscriptionRepo.getConfirmedSubscriptions.mockResolvedValue([
      { id: 1 },
    ]);
    mockNotificationRepo.send.mockRejectedValueOnce(new Error('fail'));

    await expect(
      service['notifySubscribers'](NotificationFrequency.DAILY),
    ).rejects.toThrow('fail');
  });

  it('notifyHourly should call notifySubscribers with HOURLY', async () => {
    const spy = jest
      .spyOn(service, 'notifySubscribers' as keyof NotificationService)
      .mockResolvedValue(undefined);
    await service.notifyHourly();
    expect(spy).toHaveBeenCalledWith(NotificationFrequency.HOURLY);
  });

  it('notifyDaily should call notifySubscribers with DAILY', async () => {
    const spy = jest
      .spyOn(service, 'notifySubscribers' as keyof NotificationService)
      .mockResolvedValue(undefined);
    await service.notifyDaily();
    expect(spy).toHaveBeenCalledWith(NotificationFrequency.DAILY);
  });
});
