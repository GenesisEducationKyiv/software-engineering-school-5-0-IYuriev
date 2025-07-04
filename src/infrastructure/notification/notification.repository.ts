import { Injectable } from '@nestjs/common';
import { NotificationRepo } from 'src/core/notification/notification-repository.interface';
import { EmailService } from '../email/email.service';
import { WeatherService } from 'src/application/weather/use-cases/weather.service';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'src/constants/types/subscription';
import { formatWeatherMessage } from 'src/utils/notification/notification.format';

@Injectable()
export class NotificationRepository implements NotificationRepo {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
    private readonly config: ConfigService,
  ) {}

  async send(sub: Subscription): Promise<void> {
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
