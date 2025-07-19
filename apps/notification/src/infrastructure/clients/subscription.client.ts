import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  SUBSCRIPTION_PACKAGE,
  GrpcSubscriptionClient,
  SubscriptionEntity,
  AppSubscriptionClient,
} from '../../application/interfaces/subscription.client.interface';
import { GetConfirmedSubscriptionsRequest } from '../../../../../libs/proto/generated/subscription';

@Injectable()
export class SubscriptionGrpcClient
  implements OnModuleInit, AppSubscriptionClient
{
  private subscriptionService: GrpcSubscriptionClient;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService = this.client.getService<GrpcSubscriptionClient>(
      'SubscriptionService',
    );
  }

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
