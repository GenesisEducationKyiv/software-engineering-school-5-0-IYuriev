import { Module } from '@nestjs/common';
import { PrismaService } from 'src/subscription/infrastucture/prisma/prisma.service';
import { NotificationRepositoryToken } from './application/interfaces/notification-repository.interface';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { EmailModule } from '../email/email.module';
import { NotificationService } from './application/use-case/notification.service';
import { NotificationRepository } from 'src/notification/infrastructure/notification.repository';

@Module({
  imports: [EmailModule, WeatherModule, SubscriptionModule],
  providers: [
    NotificationService,
    PrismaService,
    NotificationRepository,
    {
      provide: NotificationRepositoryToken,
      useExisting: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
