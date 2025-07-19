import { Module } from '@nestjs/common';
import { HttpModule } from '../../../libs/common/http/http.module';
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
})
export class AppModule {}
