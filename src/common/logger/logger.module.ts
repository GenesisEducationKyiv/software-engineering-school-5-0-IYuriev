import { Global, Module } from '@nestjs/common';
import { WinstonLogger } from 'src/common/logger/logger.service';

@Global()
@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}
