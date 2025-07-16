import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from '../application/subscription/interfaces/subscription-repoository.interface';
import { Frequency } from '../../../subscription/src/domain/subscription/subscription.entity';
import {
  SubscriptionProvider,
  SubscriptionServiceToken,
} from '../../../subscription/src/domain/subscription/subscription-service.interface';

@Controller('subscription')
export class SubscriptionApiController {
  constructor(
    @Inject(SubscriptionServiceToken)
    private readonly subscriptionService: SubscriptionProvider,
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscriptionDto) {
    await this.subscriptionService.subscribe(dto);
    return true;
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.subscriptionService.confirm(token);
    return true;
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.subscriptionService.unsubscribe(token);
    return true;
  }

  @Get('confirmed/:frequency')
  async getConfirmedSubscriptions(@Param('frequency') frequency: Frequency) {
    return this.subscriptionRepo.getConfirmedSubscriptions(frequency);
  }
}
