import { Inject, Injectable } from '@nestjs/common';
import {
  GrpcSubscriptionClient,
  AppSubscriptionClient,
} from '../../application/subscription.client.interface';
import {
  SubscribeRequest,
  SuccessResponse,
  TokenRequest,
} from '../../../../../libs/proto/generated/subscription';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionGrpcClient implements AppSubscriptionClient {
  constructor(
    @Inject('SubscriptionService')
    private readonly subscriptionService: GrpcSubscriptionClient,
  ) {}

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
