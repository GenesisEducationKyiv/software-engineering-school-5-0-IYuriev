import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WinstonLogger } from '../logger/logger.service';

@Injectable()
export class HttpClient {
  constructor(private readonly logger: WinstonLogger) {}

  async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
      this.logger.error(
        `Fetch error from ${url}: ${res.status} ${res.statusText}`,
      );
      throw new HttpException(
        `${res.status} ${res.statusText}`,
        res.status as HttpStatus,
      );
    }

    return (await res.json()) as T;
  }
}
