import { Module } from '@nestjs/common';
import { HttpModule } from '../../../libs/common/http/http.module';
import { NotificationService } from './application/use-case/notification.service';
import { NotificationRepository } from './infrastructure/notification.repository';
import { NotificationRepositoryToken } from './application/interfaces/notification-repository.interface';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './infrastructure/notification.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  providers: [
    NotificationService,
    NotificationRepository,
    {
      provide: NotificationRepositoryToken,
      useExisting: NotificationRepository,
    },
  ],
})
export class AppModule {}
