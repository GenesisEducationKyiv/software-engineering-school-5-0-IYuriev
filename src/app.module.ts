import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { FetchModule } from './fetch/fetch.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FetchModule,
    WeatherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
