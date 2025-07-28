import { HttpStatus } from '@nestjs/common';

export const grpcToHttp: Record<number, number> = {
  0: HttpStatus.OK,
  1: HttpStatus.INTERNAL_SERVER_ERROR,
  2: HttpStatus.INTERNAL_SERVER_ERROR,
  3: HttpStatus.BAD_REQUEST,
  4: 408,
  5: HttpStatus.NOT_FOUND,
  6: HttpStatus.CONFLICT,
  7: HttpStatus.FORBIDDEN,
  8: HttpStatus.REQUEST_TIMEOUT,
  9: HttpStatus.CONFLICT,
  10: HttpStatus.CONFLICT,
  11: HttpStatus.PRECONDITION_FAILED,
  12: HttpStatus.NOT_IMPLEMENTED,
  13: HttpStatus.INTERNAL_SERVER_ERROR,
  14: HttpStatus.SERVICE_UNAVAILABLE,
  15: HttpStatus.FORBIDDEN,
  16: HttpStatus.UNAUTHORIZED,
};
