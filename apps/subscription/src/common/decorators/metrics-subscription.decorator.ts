import {
  SubscriptionProvider,
  SubscriptionPayload,
} from '../../domain/subscription/subscription-service.interface';
import { measureDuration } from '../metrics/measureDuration';
import { MetricsService } from '../metrics/metrics.service';

export class MetricsSubscriptionDecorator implements SubscriptionProvider {
  constructor(
    private readonly provider: SubscriptionProvider,
    private readonly metrics: MetricsService,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    const { ms, error } = await measureDuration(() =>
      this.provider.subscribe(payload),
    );
    this.metrics.observeSubscribeDuration(ms, !error, payload.email);
    if (error) {
      this.metrics.incSubscribeError();
      throw error;
    } else {
      this.metrics.incSubscribeSuccess();
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
