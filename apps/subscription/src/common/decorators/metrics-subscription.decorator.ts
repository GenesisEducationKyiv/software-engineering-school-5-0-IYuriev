import {
  SubscriptionProvider,
  SubscriptionPayload,
} from '../../domain/subscription/subscription-service.interface';
import { MetricsService } from '../metrics/metrics.service';

export class MetricsSubscriptionDecorator implements SubscriptionProvider {
  constructor(
    private readonly provider: SubscriptionProvider,
    private readonly metrics: MetricsService,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    try {
      await this.provider.subscribe(payload);
      this.metrics.incSubscribeSuccess();
    } catch (error) {
      this.metrics.incSubscribeError();
      throw error;
    }
  }

  async confirm(token: string): Promise<void> {
    try {
      await this.provider.confirm(token);
      this.metrics.incConfirmSuccess();
    } catch (error) {
      this.metrics.incConfirmError();
      throw error;
    }
  }

  async unsubscribe(token: string): Promise<void> {
    try {
      await this.provider.unsubscribe(token);
      this.metrics.incUnsubscribeSuccess();
    } catch (error) {
      this.metrics.incUnsubscribeError();
      throw error;
    }
  }
}
