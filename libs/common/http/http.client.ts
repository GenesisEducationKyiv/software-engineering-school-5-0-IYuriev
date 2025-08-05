import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class HttpClient {
  async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
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
      throw new HttpException(
        `${res.status} ${res.statusText}`,
        res.status as HttpStatus,
      );
    }
    return (await res.json()) as T;
  }
}
