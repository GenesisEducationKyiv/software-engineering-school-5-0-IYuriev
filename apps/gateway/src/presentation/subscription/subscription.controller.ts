import { Controller, Post, Body, Get, Param, UsePipes } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CityValidationPipe } from '../../common/pipes/city.validation.pipe';
import { AppSubscriptionClient } from '../../application/subscription.client.interface';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: AppSubscriptionClient) {}

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
