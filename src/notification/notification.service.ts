import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationFrequency } from '../constants/enums/subscription';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { formatWeatherMessage } from '../utils/notification/notification.format';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class NotificationService {
  private readonly unsubscribeUrl = this.config.get<string>('UNSUBSCRIBE_URL');

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async notifyHourly() {
    await this.notifySubscribers(NotificationFrequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyDaily() {
    await this.notifySubscribers(NotificationFrequency.DAILY);
  }

  private async notifySubscribers(frequency: NotificationFrequency) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { confirmed: true, frequency },
      include: { tokens: true },
    });

    for (const sub of subscriptions) {
      const weather = await this.weatherService.getWeather({ city: sub.city });
      const token = sub.tokens[0]?.token;
      const link = `${this.unsubscribeUrl}/${token}`;
      const message = formatWeatherMessage(sub.city, weather, link);

      await this.emailService.sendForecastEmail(sub.email, sub.city, message);
    }
  }
}
