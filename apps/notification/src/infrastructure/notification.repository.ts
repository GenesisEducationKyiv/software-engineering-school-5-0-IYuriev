import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationRepo } from '../../../notification/src/application/interfaces/notification-repository.interface';
import { EmailGrpcClient } from './clients/email.client';
import { SubscriptionEntity } from '../../../subscription/src/domain/subscription/subscription.entity';
import { formatWeatherMessage } from '../../../../libs/utils/notification/notification.format';
import { WeatherGrpcClient } from './clients/weather.client';

@Injectable()
export class NotificationRepository implements NotificationRepo {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly emailService: EmailGrpcClient,
    private readonly weatherService: WeatherGrpcClient,
    private readonly config: ConfigService,
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
}
