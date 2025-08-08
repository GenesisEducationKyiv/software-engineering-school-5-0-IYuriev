import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import {
  SubscriptionProvider,
  SubscriptionPayload,
} from '../../domain/subscription/subscription-service.interface';

export class LogUseCaseSubscriptionDecorator implements SubscriptionProvider {
  constructor(
    private readonly provider: SubscriptionProvider,
    private readonly logger: WinstonLogger,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.subscribe(payload);
      this.logger.log(`Subscribe success`, start, {
        payload,
      });
    } catch (error: unknown) {
      this.logger.error(`Subscribe error`, start, {
        payload,
        error,
      });
      throw error;
    }
  }

  async confirm(token: string): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.confirm(token);
      this.logger.log(`Confirm subscription success`, start, { token });
    } catch (error: unknown) {
      this.logger.error(`Confirm subscription error`, start, {
        token,
        error,
      });
      throw error;
    }
  }

  async unsubscribe(token: string): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.unsubscribe(token);
      this.logger.log(`Unsubscribe success`, start, { token });
    } catch (error: unknown) {
      this.logger.error(`Unsubscribe error`, start, {
        token,
        error,
      });
      throw error;
    }
  }
}
