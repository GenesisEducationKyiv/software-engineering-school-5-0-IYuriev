import { Global, Module } from '@nestjs/common';
import { WinstonLogger } from './logger.service';

export const GATEWAY_MODULE_LOGGER = 'GATEWAY_MODULE_LOGGER';
export const HTTP_CLIENT_LOGGER = 'HTTP_CLIENT_LOGGER';
export const WEATHER_MODULE_LOGGER = 'WEATHER_MODULE_LOGGER';
export const CACHE_SERVICE_LOGGER = 'CACHE_SERVICE_LOGGER';
export const SUBSCRIPTION_SERVICE_LOGGER = 'SUBSCRIPTION_SERVICE_LOGGER';
export const SUBSCRIPTION_REPO_LOGGER = 'SUBSCRIPTION_REPOSITORY_LOGGER';
export const EMAIL_SERVICE_LOGGER = 'EMAIL_SERVICE_LOGGER';
export const NOTIFICATION_SENDER_LOGGER = 'NOTIFICATION_SENDER_LOGGER';

@Global()
@Module({
  providers: [
    {
      provide: WinstonLogger,
      useFactory: () => new WinstonLogger('DefaultService'),
    },
    {
      provide: GATEWAY_MODULE_LOGGER,
      useFactory: () => new WinstonLogger('GatewayModule'),
    },
    {
      provide: HTTP_CLIENT_LOGGER,
      useFactory: () => new WinstonLogger('HttpClient'),
    },
    {
      provide: WEATHER_MODULE_LOGGER,
      useFactory: () => new WinstonLogger('WeatherModule'),
    },
    {
      provide: CACHE_SERVICE_LOGGER,
      useFactory: () => new WinstonLogger('CacheService'),
    },
    {
      provide: SUBSCRIPTION_SERVICE_LOGGER,
      useFactory: () => new WinstonLogger('SubscriptionService'),
    },
    {
      provide: SUBSCRIPTION_REPO_LOGGER,
      useFactory: () => new WinstonLogger('SubscriptionRepository'),
    },
    {
      provide: EMAIL_SERVICE_LOGGER,
      useFactory: () => new WinstonLogger('EmailService'),
    },
    {
      provide: NOTIFICATION_SENDER_LOGGER,
      useFactory: () => new WinstonLogger('NotificationSender'),
    },
  ],
  exports: [
    WinstonLogger,
    GATEWAY_MODULE_LOGGER,
    HTTP_CLIENT_LOGGER,
    WEATHER_MODULE_LOGGER,
    CACHE_SERVICE_LOGGER,
    SUBSCRIPTION_SERVICE_LOGGER,
    SUBSCRIPTION_REPO_LOGGER,
    EMAIL_SERVICE_LOGGER,
    NOTIFICATION_SENDER_LOGGER,
  ],
})
export class LoggerModule {}
