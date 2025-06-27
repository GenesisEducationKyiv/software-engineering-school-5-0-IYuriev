import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from './interfaces/subscription-repoository.interface';
import {
  EmailServiceToken,
  EmailProvider,
} from '../email/interfaces/email-service.interface';
import {
  TokenProvider,
  TokenServiceToken,
} from '../token/interfaces/token-service.interface';
import { SubscriptionProvider } from './interfaces/subscription-service.interface';

@Injectable()
export class SubscriptionService implements SubscriptionProvider {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
    @Inject(EmailServiceToken) private readonly emailService: EmailProvider,
    @Inject(TokenServiceToken) private readonly tokenService: TokenProvider,
  ) {}

  async subscribe(dto: CreateSubscriptionDto): Promise<void> {
    const existing = await this.subscriptionRepo.findSubscription(dto);
    if (existing) throw new ConflictException('Email already subscribed');

    const subscription = await this.subscriptionRepo.create(dto);
    const token = await this.tokenService.createConfirmToken(subscription.id);
    await this.emailService.sendConfirmationEmail(dto.email, token);
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
