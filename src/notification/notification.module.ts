import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { WeatherService } from 'src/weather/weather.service';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheModule } from 'src/cache/cache.module';
import { CityModule } from 'src/city/city.module';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionRepository } from 'src/subscription/subscription.repository';
import { NotificationRepository } from './notification.repository';
import { SubscriptionRepositoryToken } from 'src/subscription/interfaces/subscription-repoository.interface';
import { NotificationRepositoryToken } from './interfaces/notification-repository.interface';
import { WeatherClientModule } from 'src/weather-client/weather-client.module';

@Module({
  imports: [
    FetchModule,
    CacheModule,
    CityModule,
    EmailModule,
    WeatherClientModule,
  ],
  exports: [NotificationService],
  providers: [
    NotificationService,
    PrismaService,
    EmailService,
    WeatherService,
    {
      provide: SubscriptionRepositoryToken,
      useClass: SubscriptionRepository,
    },
    {
      provide: NotificationRepositoryToken,
      useClass: NotificationRepository,
    },
    SubscriptionRepository,
    NotificationRepository,
  ],
})
export class NotificationModule {}
