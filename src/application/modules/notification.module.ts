import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { EmailService } from 'src/infrastructure/email/email.service';
import { WeatherService } from 'src/application/weather/use-cases/weather.service';
import { NotificationRepositoryToken } from '../notification/interfaces/notification-repository.interface';
import { SubscriptionModule } from 'src/application/modules/subscription.module';
import { WeatherModule } from 'src/application/modules/weather.module';
import { HttpModule } from './http.module';
import { CacheModule } from './cache.module';
import { EmailModule } from './email.module';
import { NotificationService } from '../notification/use-cases/notification.service';
import { NotificationRepository } from 'src/infrastructure/notification/notification.repository';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    EmailModule,
    WeatherModule,
    SubscriptionModule,
  ],
  providers: [
    NotificationService,
    PrismaService,
    EmailService,
    WeatherService,
    NotificationRepository,
    {
      provide: NotificationRepositoryToken,
      useExisting: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
