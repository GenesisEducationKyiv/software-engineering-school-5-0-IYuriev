import { Injectable, LoggerService } from '@nestjs/common';
import { getWinstonFormat } from '../../utils/logger/logger.format';
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

  log = (message: string, ...args: unknown[]) => {
    this.logger.info(message, ...args);
  };

  error = (message: string, ...args: unknown[]) => {
    this.logger.error(message, ...args);
  };

  warn = (message: string, ...args: unknown[]) => {
    this.logger.warn(message, ...args);
  };

  debug? = (message: string, ...args: unknown[]) => {
    this.logger.debug(message, ...args);
  };

  verbose? = (message: string, ...args: unknown[]) => {
    this.logger.verbose(message, ...args);
  };
}
