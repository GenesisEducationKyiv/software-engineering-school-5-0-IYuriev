import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  NotificationRepo,
  NotificationRepositoryToken,
} from '../interfaces/notification-repository.interface';
import { Frequency } from '../../../../subscription/src/domain/subscription/subscription.entity';
import { NotificationProvider } from '../../domain/notification-service.interface';
import { SubscriptionHttpClient } from '../../infrastructure/clients/subscription-http.client';

@Injectable()
export class NotificationService implements NotificationProvider {
  constructor(
    private readonly subscriptionClient: SubscriptionHttpClient,
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
