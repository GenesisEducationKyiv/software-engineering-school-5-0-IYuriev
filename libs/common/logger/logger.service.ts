import { Injectable, LoggerService } from '@nestjs/common';
import { getWinstonFormat } from './logger.format';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;
  private serviceName: string;

  constructor(serviceName = 'unknown-service') {
    this.serviceName = serviceName;
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const dailyRotateFile = new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
      level: 'debug',
    });

    const consoleTransport = new winston.transports.Console({
      format: getWinstonFormat(this.serviceName),
    });

    this.logger = winston.createLogger({
      level: 'debug',
      format: getWinstonFormat(this.serviceName),
      defaultMeta: { service: this.serviceName },
      transports: [dailyRotateFile, consoleTransport],
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(logsDir, 'exceptions.log'),
        }),
      ],
    });
  }

  private getDurationMeta(startTime?: number, args?: unknown[]) {
    if (typeof startTime === 'number') {
      const duration = `${Date.now() - startTime}ms`;
      if (args && args.length > 0 && typeof args[0] === 'object') {
        return { ...args[0], duration };
      }
      return { duration };
    }
    return args && args.length > 0 ? args[0] : undefined;
  }

  log = (message: string, startTime?: number, ...args: unknown[]) => {
    this.logger.info(message, this.getDurationMeta(startTime, args));
  };

  error = (message: string, startTime?: number, ...args: unknown[]) => {
    this.logger.error(message, this.getDurationMeta(startTime, args));
  };

  warn = (message: string, startTime?: number, ...args: unknown[]) => {
    this.logger.warn(message, this.getDurationMeta(startTime, args));
  };

  debug? = (message: string, startTime?: number, ...args: unknown[]) => {
    this.logger.debug(message, this.getDurationMeta(startTime, args));
  };

  verbose? = (message: string, startTime?: number, ...args: unknown[]) => {
    this.logger.verbose(message, this.getDurationMeta(startTime, args));
  };
}
