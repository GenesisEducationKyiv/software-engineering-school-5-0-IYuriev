import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { WeatherService } from '../weather/weather.service';
import { ConfigService } from '@nestjs/config';
import { formatWeatherMessage } from '../utils/notification/notification.format';

import { ISubscription } from 'src/constants/types/subscription';
import { INotificationRepository } from './interfaces/notification-repository.interface';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
    private readonly config: ConfigService,
  ) {}

  async send(sub: ISubscription): Promise<void> {
    const weather = await this.weatherService.getWeather(sub.city);
    const link = `${this.unsubscribeUrl}/${sub.token}`;
    const message = formatWeatherMessage(sub.city, weather, link);

    await this.emailService.sendForecastEmail({
      to: sub.email,
      subject: sub.city,
      text: message,
    });
  }
}
