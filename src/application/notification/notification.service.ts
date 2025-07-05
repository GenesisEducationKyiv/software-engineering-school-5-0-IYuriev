import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Frequency } from 'src/core/subscription/subscription.entity';
import {
  NotificationRepo,
  NotificationRepositoryToken,
} from 'src/core/notification/notification-repository.interface';
import { NotificationProvider } from 'src/core/notification/notification-service.interface';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from 'src/core/subscription/subscription-repoository.interface';

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
    await this.notifySubscribers(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyDaily(): Promise<void> {
    await this.notifySubscribers(Frequency.DAILY);
  }

  private async notifySubscribers(frequency: Frequency): Promise<void> {
    const subscriptions =
      await this.subscriptionRepo.getConfirmedSubscriptions(frequency);
    for (const sub of subscriptions) {
      await this.notificationRepo.send(sub);
    }
  }
}
