import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import {
  ISubscriptionRepository,
  SubscriptionRepositoryToken,
} from './interfaces/subscription-repoository.interface';
import {
  EmailServiceToken,
  IEmailService,
} from 'src/email/interfaces/email-service.interface';
import {
  ITokenService,
  TokenServiceToken,
} from 'src/token/interfaces/token-service.interface';
import { ISubscriptionService } from './interfaces/subscription-service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: ISubscriptionRepository,
    @Inject(EmailServiceToken) private readonly emailService: IEmailService,
    @Inject(TokenServiceToken) private readonly tokenService: ITokenService,
  ) {}

  async subscribe(dto: CreateSubscriptionDto): Promise<{ message: string }> {
    const existing = await this.subscriptionRepo.findSubscription(dto);
    if (existing) throw new ConflictException('Email already subscribed');

    const subscription = await this.subscriptionRepo.create(dto);
    const token = await this.tokenService.createConfirmToken(subscription.id);
    await this.emailService.sendConfirmationEmail(dto.email, token);

    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const dbToken = await this.tokenService.getValidToken(token);
    await this.subscriptionRepo.confirm(dbToken.subscriptionId);

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const dbToken = await this.tokenService.getValidToken(token);
    await this.subscriptionRepo.delete(dbToken.subscriptionId);

    return { message: 'Unsubscribed successfully' };
  }
}
