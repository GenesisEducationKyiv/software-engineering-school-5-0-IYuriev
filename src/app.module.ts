import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggingMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SubscriptionControllerModule } from './presentation/subscription/subscription-controller.module';
import { NotificationModule } from './notification/notification.module';
import { WeatherControllerModule } from './presentation/weather/weather-controller.module';

@Module({
  imports: [
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SubscriptionControllerModule,
    WeatherControllerModule,
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
