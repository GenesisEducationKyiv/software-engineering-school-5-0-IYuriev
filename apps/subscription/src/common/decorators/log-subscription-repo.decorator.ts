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
    try {
      const result = await this.repo.getConfirmedSubscriptions(frequency);
      this.logger.debug?.(`getConfirmedSubscriptions success`, {
        count: result.length,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`getConfirmedSubscriptions error`, {
        frequency,
        error,
      });
      throw error;
    }
  }

  async findSubscription(
    payload: SubscriptionPayload,
  ): Promise<SubscriptionEntity | null> {
    try {
      const result = await this.repo.findSubscription(payload);
      this.logger.debug?.(`Find Subscription result`, {
        found: !!result,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Find Subscription error`, {
        payload,
        error,
      });
      throw error;
    }
  }

  async create(payload: SubscriptionPayload): Promise<SubscriptionEntity> {
    try {
      const result = await this.repo.create(payload);
      this.logger.debug?.(`Create subscription success`, {
        id: result.id,
      });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Create error`, {
        payload,
        error,
      });
      throw error;
    }
  }

  async confirm(id: number): Promise<void> {
    try {
      await this.repo.confirm(id);
      this.logger.debug?.(`Confirm subscription success`, { id });
    } catch (error: unknown) {
      this.logger.error(`Confirm subscription error`, { id, error });
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
      this.logger.debug?.(`Delete subscription success`, { id });
    } catch (error: unknown) {
      this.logger.error(`Delete subscription error`, { id, error });
      throw error;
    }
  }
}
