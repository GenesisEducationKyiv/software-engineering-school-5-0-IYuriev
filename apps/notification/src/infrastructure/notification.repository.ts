import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationRepo } from '../../../notification/src/application/interfaces/notification-repository.interface';
import { EmailHttpClient } from './clients/email-http.client';
import { SubscriptionEntity } from '../../../subscription/src/domain/subscription/subscription.entity';
import { formatWeatherMessage } from '../../../../libs/utils/notification/notification.format';
import { WeatherHttpClient } from './clients/weather-http.client';

@Injectable()
export class NotificationRepository implements NotificationRepo {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly emailService: EmailHttpClient,
    private readonly weatherService: WeatherHttpClient,
    private readonly config: ConfigService,
  ) {}

  async send(sub: SubscriptionEntity): Promise<void> {
    const weather = await this.weatherService.getWeather(sub.city);
    const link = `${this.unsubscribeUrl}/${sub.tokens[0].token}`;
    const message = formatWeatherMessage(sub.city, weather, link);

    await this.emailService.sendForecastEmail({
      to: sub.email,
      subject: sub.city,
      text: message,
    });
  }
}
