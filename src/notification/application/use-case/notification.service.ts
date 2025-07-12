import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Frequency } from 'src/subscription/domain/subscription/subscription.entity';
import {
  NotificationRepo,
  NotificationRepositoryToken,
} from 'src/notification/application/interfaces/notification-repository.interface';
import { NotificationProvider } from 'src/notification/domain/notification-service.interface';
import { SubscriptionClient } from 'src/subscription/presentation/subscription.client';

@Injectable()
export class NotificationService implements NotificationProvider {
  constructor(
    private readonly subscriptionClient: SubscriptionClient,
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
    const subscriptions = await this.subscriptionClient.confirmed(frequency);
    for (const sub of subscriptions) {
      await this.notificationRepo.send(sub);
    }
  }
}
