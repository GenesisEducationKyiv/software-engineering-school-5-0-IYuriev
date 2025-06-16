import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WeatherService } from '../weather/weather.service';
import { FetchModule } from '../fetch/fetch.module';
import { CacheModule } from '../cache/cache.module';
import { CityModule } from '../city/city.module';
import { EmailModule } from '../email/email.module';
import { NotificationRepository } from './notification.repository';
import { NotificationRepositoryToken } from './interfaces/notification-repository.interface';
import { WeatherClientModule } from '../weather-client/weather-client.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { SubscriptionRepositoryToken } from '../subscription/interfaces/subscription-repoository.interface';

@Module({
  imports: [
    FetchModule,
    CacheModule,
    CityModule,
    EmailModule,
    WeatherClientModule,
    SubscriptionModule,
  ],
  providers: [
    NotificationService,
    PrismaService,
    EmailService,
    WeatherService,
    NotificationRepository,
    SubscriptionRepository,
    {
      provide: SubscriptionRepositoryToken,
      useExisting: SubscriptionRepository,
    },
    {
      provide: NotificationRepositoryToken,
      useExisting: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
