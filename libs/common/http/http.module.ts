import { Module } from '@nestjs/common';
import { HttpClient } from './http.client';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [HttpClient],
  exports: [HttpClient],
})
export class HttpModule {}
