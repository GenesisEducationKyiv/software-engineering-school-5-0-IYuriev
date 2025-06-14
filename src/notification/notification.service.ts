import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationFrequency } from '../constants/enums/subscription';
import {
  ISubscriptionRepository,
  SubscriptionRepositoryToken,
} from 'src/subscription/interfaces/subscription-repoository.interface';
import {
  INotificationRepository,
  NotificationRepositoryToken,
} from './interfaces/notification-repository.interface';
import { INotificationService } from './interfaces/notification-service.interface';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: ISubscriptionRepository,
    @Inject(NotificationRepositoryToken)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async notifyHourly(): Promise<void> {
    await this.notifySubscribers(NotificationFrequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyDaily(): Promise<void> {
    await this.notifySubscribers(NotificationFrequency.DAILY);
  }

  private async notifySubscribers(
    frequency: NotificationFrequency,
  ): Promise<void> {
    const subscriptions =
      await this.subscriptionRepo.getConfirmedSubscriptions(frequency);
    for (const sub of subscriptions) {
      await this.notificationRepo.send(sub);
    }
  }
}
