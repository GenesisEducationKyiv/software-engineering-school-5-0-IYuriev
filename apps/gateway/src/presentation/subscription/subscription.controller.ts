import { Controller, Post, Body, Get, Param, UsePipes } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionGrpcClient } from '../../infrastructure/clients/subscription.client';
import { CityValidationPipe } from '../../infrastructure/pipes/city.validation.pipe';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionGrpcClient) {}

  @UsePipes(CityValidationPipe)
  @Post('/subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    await this.subscriptionService.subscribe(dto);
    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.subscriptionService.confirm({ token });
    return { message: 'Subscription confirmed successfully' };
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.subscriptionService.unsubscribe({ token });
    return { message: 'Unsubscribed successfully' };
  }
}
