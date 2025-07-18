import { Inject, Injectable } from '@nestjs/common';
import {
  SubscriptionPayload,
  SubscriptionProvider,
} from '../../../domain/subscription/subscription-service.interface';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from '../interfaces/subscription-repoository.interface';
import {
  TokenProvider,
  TokenServiceToken,
} from '../../../domain/token/token-service.interface';
import { EmailGrpcClient } from '../../../infrastucture/clients/email.client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionService implements SubscriptionProvider {
  constructor(
    private readonly emailClient: EmailGrpcClient,
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
    @Inject(TokenServiceToken)
    private readonly tokenService: TokenProvider,
  ) {}

  async subscribe(payload: SubscriptionPayload): Promise<void> {
    const existing = await this.subscriptionRepo.findSubscription(payload);
    if (existing) {
      throw new RpcException({ code: 6, message: 'Email already subscribed' });
    }

    const subscription = await this.subscriptionRepo.create(payload);
    const token = await this.tokenService.createConfirmToken(subscription.id);
    await this.emailClient.sendConfirmationEmail(payload.email, token);
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
