import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { HttpModule } from '../../../../../libs/common/http/http.module';
import { SubscriptionHttpClient } from '../../infrastructure/clients/subscription-http.client';

@Module({
  imports: [HttpModule],
  providers: [SubscriptionHttpClient],
  controllers: [SubscriptionController],
})
export class SubscriptionControllerModule {}
