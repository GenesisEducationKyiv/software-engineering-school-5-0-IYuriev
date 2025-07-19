import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Frequency,
  NotificationSend,
} from '../interfaces/notification-sender.interface';
import { NotificationProvider } from '../../domain/notification-service.interface';

@Injectable()
export class NotificationService implements NotificationProvider {
  constructor(private readonly notificationSender: NotificationSend) {}

  @Cron(CronExpression.EVERY_HOUR)
  async notifyHourly(): Promise<void> {
    await this.notifySubscribers(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyDaily(): Promise<void> {
    await this.notifySubscribers(Frequency.DAILY);
  }

  private async notifySubscribers(frequency: Frequency): Promise<void> {
    await this.notificationSender.sendByFrequency(frequency);
  }
}
