import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { SubscriptionDto } from '../../../../../apps/subscription/src/presentation/dto/subscription.dto';
import { SubscriptionClient } from '../../application/subscription.client.interface';

@Injectable()
export class SubscriptionHttpClient implements SubscriptionClient {
  constructor(private readonly httpClient: HttpClient) {}

  async subscribe(payload: SubscriptionDto): Promise<void> {
    await this.httpClient.post(
      `http://subscription:4002/subscription/subscribe`,
      payload,
    );
  }

  async confirm(token: string): Promise<void> {
    await this.httpClient.get(
      `http://subscription:4002/subscription/confirm/${token}`,
    );
  }

  async unsubscribe(token: string): Promise<void> {
    await this.httpClient.get(
      `http://subscription:4002/subscription/unsubscribe/${token}`,
    );
  }
}
