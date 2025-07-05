import { Global, Module } from '@nestjs/common';
import { WinstonLogger } from 'src/infrastructure/logger/logger.service';

@Global()
@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}
