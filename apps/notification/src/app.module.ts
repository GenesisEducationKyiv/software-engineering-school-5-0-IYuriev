import { Module } from '@nestjs/common';
import { HttpModule } from '../../../libs/common/http/http.module';
import { NotificationService } from './application/use-case/notification.service';
import { NotificationRepository } from './infrastructure/notification.repository';
import { EmailHttpClient } from './infrastructure/clients/email-http.client';
import { NotificationRepositoryToken } from './application/interfaces/notification-repository.interface';
import { WeatherHttpClient } from './infrastructure/clients/weather-http.client';
import { SubscriptionHttpClient } from './infrastructure/clients/subscription-http.client';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, ConfigModule, ScheduleModule.forRoot()],
  providers: [
    NotificationService,
    NotificationRepository,
    WeatherHttpClient,
    EmailHttpClient,
    SubscriptionHttpClient,
    {
      provide: NotificationRepositoryToken,
      useExisting: NotificationRepository,
    },
  ],
})
export class AppModule {}
