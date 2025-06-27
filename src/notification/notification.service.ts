import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationFrequency } from '../constants/enums/subscription';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from '../subscription/interfaces/subscription-repoository.interface';
import {
  NotificationRepo,
  NotificationRepositoryToken,
} from './interfaces/notification-repository.interface';
import { NotificationProvider } from './interfaces/notification-service.interface';

@Injectable()
export class NotificationService implements NotificationProvider {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
    @Inject(NotificationRepositoryToken)
    private readonly notificationRepo: NotificationRepo,
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
