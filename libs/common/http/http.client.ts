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

  async post<T = unknown>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try {
        const errorResponse = (await res.json()) as { message?: string };
        msg = errorResponse.message || msg;
      } catch (error) {
        this.logger.error(`Error parsing response from ${url}: ${error}`);
      }
      throw new HttpException(msg, res.status as HttpStatus);
    }

    return (await res.json()) as T;
  }
}
