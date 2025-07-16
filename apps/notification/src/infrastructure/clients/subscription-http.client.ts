import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { SubscriptionEntity } from '../../../../../apps/subscription/src/domain/subscription/subscription.entity';

@Injectable()
export class SubscriptionHttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async confirmed(frequency: string): Promise<SubscriptionEntity[]> {
    return this.httpClient.get<SubscriptionEntity[]>(
      `http://subscription:4002/subscription/confirmed/${frequency}`,
    );
  }
}
