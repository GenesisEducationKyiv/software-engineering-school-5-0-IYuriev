import { Injectable, LoggerService } from '@nestjs/common';
import { getWinstonFormat } from 'src/utils/logger/logger.format';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const dailyRotateFile = new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
      level: 'info',
    });

    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: getWinstonFormat(),
      transports: [dailyRotateFile, consoleTransport],
      exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' }),
      ],
    });
  }

  log(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, trace?: string, meta?: any) {
    this.logger.error(message, { trace, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug?(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  verbose?(message: string, meta?: any) {
    this.logger.verbose(message, meta);
  }
}
