import { Injectable } from '@nestjs/common';
import {
  SubscriptionPayload,
  SubscriptionProvider,
} from '../../../domain/subscription/subscription-service.interface';
import { SubscriptionRepo } from '../interfaces/subscription-repoository.interface';
import { TokenProvider } from '../../../domain/token/token-service.interface';
import { RpcException } from '@nestjs/microservices';
import { EmailPublisher } from '../interfaces/email.publisher.interface';

@Injectable()
export class SubscriptionService implements SubscriptionProvider {
  constructor(
    private readonly emailPublisher: EmailPublisher,
    private readonly subscriptionRepo: SubscriptionRepo,
    private readonly tokenService: TokenProvider,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    const existing = await this.subscriptionRepo.findSubscription(payload);
    if (existing) {
      throw new RpcException({ code: 6, message: 'Email already subscribed' });
    }
    const { email } = payload;
    const subscription = await this.subscriptionRepo.create(payload);
    const token = await this.tokenService.createConfirmToken(subscription.id);
    this.emailPublisher.sendConfirmationEmail({ email, token });
  }

  async confirm(token: string): Promise<void> {
    const dbToken = await this.tokenService.getValidToken(token);
    await this.subscriptionRepo.confirm(dbToken.subscriptionId);
  }

  async unsubscribe(token: string): Promise<void> {
    const dbToken = await this.tokenService.getValidToken(token);
    await this.subscriptionRepo.delete(dbToken.subscriptionId);
  }
}
