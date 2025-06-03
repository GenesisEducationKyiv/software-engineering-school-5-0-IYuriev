import { Controller, Post, Body, Get, Param, UsePipes } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UsePipes(CityValidationPipe)
  @Post('/subscribe')
  subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.subscribe(dto);
  }
  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    return await this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    return await this.subscriptionService.unsubscribe(token);
  }
}
