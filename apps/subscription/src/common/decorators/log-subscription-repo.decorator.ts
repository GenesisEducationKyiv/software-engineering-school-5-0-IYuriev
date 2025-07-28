import { SubscriptionRepo } from '../../application/subscription/interfaces/subscription-repoository.interface';
import { SubscriptionPayload } from '../../domain/subscription/subscription-service.interface';
import {
  SubscriptionEntity,
  Frequency,
} from '../../domain/subscription/subscription.entity';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';

export class LogSubscriptionRepoDecorator implements SubscriptionRepo {
  constructor(
    private readonly repo: SubscriptionRepo,
    private readonly logger: WinstonLogger,
  ) {}

  async getConfirmedSubscriptions(
    frequency: Frequency,
  ): Promise<SubscriptionEntity[]> {
    const start = Date.now();
    try {
      const result = await this.repo.getConfirmedSubscriptions(frequency);
      this.logger.debug?.(`Get confirmed subscriptions success`, start, {
        count: result.length,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Get confirmed subscriptions error`, start, {
        frequency,
        error,
      });
      throw error;
    }
  }

  async findSubscription(
    payload: SubscriptionPayload,
  ): Promise<SubscriptionEntity | null> {
    const start = Date.now();
    try {
      const result = await this.repo.findSubscription(payload);
      this.logger.debug?.(`Find Subscription result`, start, {
        found: !!result,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Find Subscription error`, start, {
        payload,
        error,
      });
      throw error;
    }
  }

  async create(payload: SubscriptionPayload): Promise<SubscriptionEntity> {
    const start = Date.now();
    try {
      const result = await this.repo.create(payload);
      this.logger.debug?.(`Create subscription success`, start, {
        id: result.id,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Create error`, start, {
        payload,
        error,
      });
      throw error;
    }
  }

  async confirm(id: number): Promise<void> {
    const start = Date.now();
    try {
      await this.repo.confirm(id);
      this.logger.debug?.(`Confirm subscription success`, start, { id });
    } catch (error: unknown) {
      this.logger.error(`Confirm subscription error`, start, { id, error });
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const start = Date.now();
    try {
      await this.repo.delete(id);
      this.logger.debug?.(`Delete subscription success`, start, { id });
    } catch (error: unknown) {
      this.logger.error(`Delete subscription error`, start, { id, error });
      throw error;
    }
  }
}
