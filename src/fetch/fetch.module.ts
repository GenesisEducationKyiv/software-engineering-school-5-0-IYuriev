import { Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  exports: [FetchService],
  providers: [FetchService],
})
export class FetchModule {}
