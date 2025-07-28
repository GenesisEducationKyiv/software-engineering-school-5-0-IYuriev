import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Frequency,
  NotificationSend,
} from '../application/interfaces/notification-sender.interface';
import { SubscriptionEntity } from '../../../subscription/src/domain/subscription/subscription.entity';
import { formatWeatherMessage } from '../utils/notification/notification.format';
import { AppEmailClient } from '../application/interfaces/email.client.interface';
import { AppWeatherClient } from '../application/interfaces/weather.client.interface';
import { AppSubscriptionClient } from '../application/interfaces/subscription.client.interface';
import { mapPrismaFrequencyToGrpc } from './mappers/frequency.mapper';

@Injectable()
export class NotificationSender implements NotificationSend {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly config: ConfigService,
    private readonly emailService: AppEmailClient,
    private readonly weatherService: AppWeatherClient,
    private readonly subscriptionClient: AppSubscriptionClient,
  ) {}

  async send(sub: SubscriptionEntity): Promise<void> {
    const weather = await this.weatherService.getWeather({ city: sub.city });
    const link = `${this.unsubscribeUrl}/${sub.tokens[0].token}`;
    const message = formatWeatherMessage(sub.city, weather, link);

    await this.emailService.sendForecastEmail({
      to: sub.email,
      subject: sub.city,
      text: message,
    });
  }

  async sendByFrequency(frequency: Frequency): Promise<void> {
    const grpcFrequency = mapPrismaFrequencyToGrpc(frequency);
    const subscriptions =
      await this.subscriptionClient.getConfirmedSubscriptions({
        frequency: grpcFrequency,
      });
    for (const sub of subscriptions) {
      await this.send(sub);
    }
  }
}
