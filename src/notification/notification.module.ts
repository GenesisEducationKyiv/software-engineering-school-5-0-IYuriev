import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { WeatherService } from 'src/weather/weather.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  exports: [NotificationService],
  providers: [NotificationService, PrismaService, EmailService, WeatherService],
})
export class NotificationModule {}
