import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { FetchModule } from './fetch/fetch.module';
import { WeatherModule } from './weather/weather.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FetchModule,
    WeatherModule,
    SubscriptionModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    EmailModule,
    TokenModule,
    NotificationModule,
    CacheModule,
    CityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
