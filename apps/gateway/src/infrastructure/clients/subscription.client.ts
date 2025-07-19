import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  SUBSCRIPTION_PACKAGE,
  GrpcSubscriptionClient,
  AppSubscriptionClient,
} from '../../application/subscription.client.interface';
import { ClientGrpc } from '@nestjs/microservices';
import {
  SubscribeRequest,
  SuccessResponse,
  TokenRequest,
} from '../../../../../libs/proto/generated/subscription';
import { lastValueFrom } from 'rxjs';

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

  async subscribe(data: SubscribeRequest): Promise<SuccessResponse> {
    await lastValueFrom(this.subscriptionService.subscribe(data));
    return { success: true };
  }

  async confirm(data: TokenRequest): Promise<SuccessResponse> {
    await lastValueFrom(
      this.subscriptionService.confirm({ token: data.token }),
    );
    return { success: true };
  }

  async unsubscribe(data: TokenRequest): Promise<SuccessResponse> {
    await lastValueFrom(
      this.subscriptionService.unsubscribe({ token: data.token }),
    );
    return { success: true };
  }
}
