import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  GrpcSubscriptionClient,
  SubscriptionEntity,
  AppSubscriptionClient,
} from '../../application/interfaces/subscription.client.interface';
import { GetConfirmedSubscriptionsRequest } from '../../../../../libs/proto/generated/subscription';

@Injectable()
export class SubscriptionGrpcClient implements AppSubscriptionClient {
  constructor(
    @Inject('SubscriptionService')
    private readonly subscriptionService: GrpcSubscriptionClient,
  ) {}

  async getConfirmedSubscriptions(
    data: GetConfirmedSubscriptionsRequest,
  ): Promise<SubscriptionEntity[]> {
    const response = (await lastValueFrom(
      this.subscriptionService.getConfirmedSubscriptions({
        frequency: data.frequency,
      }),
    )) as { subscriptions?: SubscriptionEntity[] };

    return response.subscriptions ?? [];
  }
}
