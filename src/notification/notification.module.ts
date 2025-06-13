import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { WeatherService } from 'src/weather/weather.service';
import { FetchModule } from 'src/fetch/fetch.module';
import { CacheModule } from 'src/cache/cache.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [FetchModule, CacheModule, CityModule],
  exports: [NotificationService],
  providers: [NotificationService, PrismaService, EmailService, WeatherService],
})
export class NotificationModule {}
