import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from 'src/common/http/http.client';
import { SubscriptionDto } from './dto/subscription.dto';
import { SubscriptionEntity } from '../domain/subscription/subscription.entity';

@Injectable()
export class SubscriptionClient {
  private readonly BASE_URL: string;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: ConfigService,
  ) {
    this.BASE_URL = this.config.get<string>('BASE_URL') ?? '';
  }

  async subscribe(payload: SubscriptionDto): Promise<void> {
    await this.httpClient.post(
      `${this.BASE_URL}/subscription/subscribe`,
      payload,
    );
  }

  async confirm(token: string): Promise<void> {
    await this.httpClient.get(`${this.BASE_URL}/subscription/confirm/${token}`);
  }

  async unsubscribe(token: string): Promise<void> {
    await this.httpClient.get(
      `${this.BASE_URL}/subscription/unsubscribe/${token}`,
    );
  }

  async confirmed(frequency: string): Promise<SubscriptionEntity[]> {
    return this.httpClient.get<SubscriptionEntity[]>(
      `${this.BASE_URL}/subscription/confirmed/${frequency}`,
    );
  }
}
