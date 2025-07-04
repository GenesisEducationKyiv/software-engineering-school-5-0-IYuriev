import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggingMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './application/modules/weather.module';
import { SubscriptionModule } from './application/modules/subscription.module';
import { NotificationModule } from './application/modules/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherClientModule } from './application/modules/weather-client.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from './application/modules/logger.module';
import { PrismaModule } from './application/modules/prisma.module';
import { TokenModule } from './application/modules/token.module';
import { CacheModule } from './application/modules/cache.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherModule,
    SubscriptionModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    TokenModule,
    NotificationModule,
    CacheModule,
    WeatherClientModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
