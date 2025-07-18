import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  SUBSCRIPTION_PACKAGE,
  SubscriptionClient,
} from '../../application/subscription.client.interface';
import { ClientGrpc } from '@nestjs/microservices';
import {
  SubscribeRequest,
  TokenRequest,
} from '../../../../../libs/proto/generated/subscription';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionGrpcClient implements OnModuleInit {
  private subscriptionService: SubscriptionClient;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService = this.client.getService<SubscriptionClient>(
      'SubscriptionService',
    );
  }

  async subscribe(data: SubscribeRequest): Promise<void> {
    await lastValueFrom(this.subscriptionService.subscribe(data));
  }

  async confirm(data: TokenRequest): Promise<void> {
    await lastValueFrom(
      this.subscriptionService.confirm({ token: data.token }),
    );
  }

  async unsubscribe(data: TokenRequest): Promise<void> {
    await lastValueFrom(
      this.subscriptionService.unsubscribe({ token: data.token }),
    );
  }
}
