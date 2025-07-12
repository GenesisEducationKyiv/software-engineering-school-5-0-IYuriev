import { Injectable } from '@nestjs/common';
import { NotificationRepo } from 'src/notification/application/interfaces/notification-repository.interface';
import { ConfigService } from '@nestjs/config';
import { formatWeatherMessage } from 'src/utils/notification/notification.format';
import { EmailClient } from 'src/email/presentation/email.clinet';
import { SubscriptionEntity } from 'src/subscription/domain/subscription/subscription.entity';
import { WeatherApiClient } from 'src/weather/presentation/weather.client';

@Injectable()
export class NotificationRepository implements NotificationRepo {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly emailService: EmailClient,
    private readonly weatherService: WeatherApiClient,
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
