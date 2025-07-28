import {
  NotificationSend,
  Frequency,
} from '../../application/interfaces/notification-sender.interface';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { SubscriptionEntity } from '../../application/interfaces/subscription.client.interface';

export class LogNotificationSenderDecorator implements NotificationSend {
  constructor(
    private readonly sender: NotificationSend,
    private readonly logger: WinstonLogger,
  ) {}

  async send(sub: SubscriptionEntity): Promise<void> {
    const start = Date.now();
    try {
      await this.sender.send(sub);
      this.logger.log('Send email success', start, {
        email: sub.email,
        city: sub.city,
      });
    } catch (error: unknown) {
      this.logger.error('Send email error', start, {
        email: sub.email,
        city: sub.city,
        error,
      });
      throw error;
    }
  }

  async sendByFrequency(frequency: Frequency): Promise<void> {
    const start = Date.now();
    try {
      await this.sender.sendByFrequency(frequency);
      this.logger.log('Send email by frequency success', start, { frequency });
    } catch (error: unknown) {
      this.logger.error('Send email by frequency error', start, {
        frequency,
        error,
      });
      throw error;
    }
  }
}
