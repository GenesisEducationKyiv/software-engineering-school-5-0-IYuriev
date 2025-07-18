import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  NotificationRepo,
  NotificationRepositoryToken,
} from '../interfaces/notification-repository.interface';
import { NotificationProvider } from '../../domain/notification-service.interface';
import { SubscriptionGrpcClient } from '../../infrastructure/clients/subscription.client';
import { Frequency } from '../../../../../apps/subscription/src/domain/subscription/subscription.entity';
import { mapPrismaFrequencyToGrpc } from '../../infrastructure/mappers/frequency.mapper';

@Injectable()
export class NotificationService implements NotificationProvider {
  constructor(
    private readonly subscriptionClient: SubscriptionGrpcClient,
    @Inject(NotificationRepositoryToken)
    private readonly notificationRepo: NotificationRepo,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async notifyHourly(): Promise<void> {
    await this.notifySubscribers(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyDaily(): Promise<void> {
    await this.notifySubscribers(Frequency.DAILY);
  }

  private async notifySubscribers(frequency: Frequency): Promise<void> {
    const grpcFrequency = mapPrismaFrequencyToGrpc(frequency);
    const subscriptions =
      await this.subscriptionClient.getConfirmedSubscriptions({
        frequency: grpcFrequency,
      });
    for (const sub of subscriptions) {
      await this.notificationRepo.send(sub);
    }
  }
}
