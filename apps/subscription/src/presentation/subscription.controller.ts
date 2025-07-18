import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SubscriptionRepo,
  SubscriptionRepositoryToken,
} from '../application/subscription/interfaces/subscription-repoository.interface';
import {
  SubscriptionProvider,
  SubscriptionServiceToken,
} from '../../../subscription/src/domain/subscription/subscription-service.interface';
import {
  GetConfirmedSubscriptionsRequest,
  SubscribeRequest,
  SuccessResponse,
  TokenRequest,
} from '../../../../libs/proto/generated/subscription';
import { mapGrpcFrequencyToPrisma } from '../infrastucture/mappers/frequency.mapper';

@Controller()
export class SubscriptionApiController {
  constructor(
    @Inject(SubscriptionServiceToken)
    private readonly subscriptionService: SubscriptionProvider,
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepo,
  ) {}

  @GrpcMethod('SubscriptionService', 'Subscribe')
  async subscribe(data: SubscribeRequest): Promise<SuccessResponse> {
    const prismaFrequency = mapGrpcFrequencyToPrisma(data.frequency);
    await this.subscriptionService.subscribe({
      ...data,
      frequency: prismaFrequency,
    });
    return { success: true };
  }

  @GrpcMethod('SubscriptionService', 'Confirm')
  async confirm(data: TokenRequest): Promise<SuccessResponse> {
    console.log('Confirming subscription with token:', data.token);
    await this.subscriptionService.confirm(data.token);
    return { success: true };
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  async unsubscribe(data: TokenRequest): Promise<SuccessResponse> {
    await this.subscriptionService.unsubscribe(data.token);
    return { success: true };
  }

  @GrpcMethod('SubscriptionService', 'GetConfirmedSubscriptions')
  async getConfirmedSubscriptions(data: GetConfirmedSubscriptionsRequest) {
    const prismaFrequency = mapGrpcFrequencyToPrisma(data.frequency);
    const subscriptions =
      await this.subscriptionRepo.getConfirmedSubscriptions(prismaFrequency);
    return { subscriptions };
  }
}
