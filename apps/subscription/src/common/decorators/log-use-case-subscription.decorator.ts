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
    try {
      await this.provider.subscribe(payload);
      this.logger.log(`Subscribe success`, {
        payload,
      });
    } catch (error: unknown) {
      this.logger.error(`Subscribe error`, {
        payload,
        error,
      });
      throw error;
    }
  }

  async confirm(token: string): Promise<void> {
    try {
      await this.provider.confirm(token);
      this.logger.log(`Confirm subscription success`, { token });
    } catch (error: unknown) {
      this.logger.error(`Confirm subscription error`, {
        token,
        error,
      });
      throw error;
    }
  }

  async unsubscribe(token: string): Promise<void> {
    try {
      await this.provider.unsubscribe(token);
      this.logger.log(`Unsubscribe success`, { token });
    } catch (error: unknown) {
      this.logger.error(`Unsubscribe error`, {
        token,
        error,
      });
      throw error;
    }
  }
}
