import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [SubscriptionModule, WeatherModule],
  controllers: [SubscriptionController],
})
export class SubscriptionControllerModule {}
