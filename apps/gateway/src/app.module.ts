import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggingMiddleware } from '../../../libs/common/middlewares/logger.middleware';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SubscriptionControllerModule } from './presentation/subscription/subscription-controller.module';
import { WeatherControllerModule } from './presentation/weather/weather-controller.module';

@Module({
  imports: [
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
