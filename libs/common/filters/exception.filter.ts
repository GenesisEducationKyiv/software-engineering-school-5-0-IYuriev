import { BadRequestException } from '@nestjs/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { grpcToHttp } from './grpc-to-http.map';

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    function hasGrpcCode(
      err: unknown,
    ): err is { code: number; message: string } {
      return (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        typeof (err as { code: unknown }).code === 'number'
      );
    }
    function extractBadRequestMessage(res: unknown): string {
      if (typeof res === 'string') return res;
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message?: unknown }).message;
        if (Array.isArray(msg)) return msg.join('; ');
        if (typeof msg === 'string') return msg;
      }
      return 'Bad request';
    }

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse();
      const message = extractBadRequestMessage(res);
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
      return;
    }

    if (hasGrpcCode(exception)) {
      const code = exception.code;
      const status = grpcToHttp[code] || HttpStatus.INTERNAL_SERVER_ERROR;
      let message = exception.message;
      const codePrefixRegex = new RegExp(`^${code} [A-Z_]+: `);
      message = message.replace(codePrefixRegex, '');
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
      return;
    }

    throw exception;
  }
}
