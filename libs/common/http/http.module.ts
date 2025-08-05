import { Module } from '@nestjs/common';
import { HttpClient } from './http.client';
import { LogHttpClientDecorator } from './logger-http.decorator';
import { HTTP_CLIENT_LOGGER, LoggerModule } from '../logger/logger.module';
import { WinstonLogger } from '../logger/logger.service';

@Module({
  imports: [LoggerModule],
  providers: [
    HttpClient,
    {
      provide: LogHttpClientDecorator,
      useFactory: (httpClient: HttpClient, logger: WinstonLogger) => {
        return new LogHttpClientDecorator(httpClient, logger);
      },
      inject: [HttpClient, HTTP_CLIENT_LOGGER],
    },
  ],
  exports: [LogHttpClientDecorator],
})
export class HttpModule {}
