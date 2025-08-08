import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from '../logger/logger.service';
import { GATEWAY_MODULE_LOGGER } from '../logger/logger.module';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(GATEWAY_MODULE_LOGGER) private readonly logger: WinstonLogger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
