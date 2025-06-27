import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { WeatherService } from 'src/weather/weather.service';
import { CacheModule } from 'src/cache/cache.module';
import { EmailModule } from 'src/email/email.module';
import { NotificationRepository } from './notification.repository';
import { NotificationRepositoryToken } from './interfaces/notification-repository.interface';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { HttpModule } from 'src/infrastructure/http/http.module';
import { WeatherModule } from 'src/weather/weather.module';

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
