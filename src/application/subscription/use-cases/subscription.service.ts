import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SubscriptionProvider } from '../../../core/subscription/subscription-service.interface';
import {
  SubscriptionPayload,
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from '../../../core/subscription/subscription-repoository.interface';
import {
  EmailServiceToken,
  EmailProvider,
} from '../../email/email-service.interface';
import {
  TokenProvider,
  TokenServiceToken,
} from '../../../core/token/token-service.interface';

@Injectable()
export class SubscriptionService implements SubscriptionProvider {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
    @Inject(EmailServiceToken) private readonly emailService: EmailProvider,
    @Inject(TokenServiceToken) private readonly tokenService: TokenProvider,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    const existing = await this.subscriptionRepo.findSubscription(payload);
    if (existing) throw new ConflictException('Email already subscribed');

    const subscription = await this.subscriptionRepo.create(payload);
    const token = await this.tokenService.createConfirmToken(subscription.id);
    await this.emailService.sendConfirmationEmail(payload.email, token);
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
