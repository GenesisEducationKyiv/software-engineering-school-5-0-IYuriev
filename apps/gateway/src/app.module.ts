import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggingMiddleware } from '../../../libs/common/middlewares/logger.middleware';
import { SubscriptionControllerModule } from './presentation/subscription/subscription-controller.module';
import { WeatherControllerModule } from './presentation/weather/weather-controller.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../../libs/common/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SubscriptionControllerModule,
    WeatherControllerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '/*api', method: RequestMethod.ALL });
  }
}
