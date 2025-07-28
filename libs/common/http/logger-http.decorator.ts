import { WinstonLogger } from '../logger/logger.service';
import { HttpClient } from './http.client';

export class LogHttpClientDecorator {
  constructor(
    private readonly wrapped: HttpClient,
    private readonly logger: WinstonLogger,
  ) {}

  async get<T = unknown>(url: string): Promise<T> {
    const start = Date.now();
    try {
      const result = await this.wrapped.get<T>(url);
      if (!result || (Array.isArray(result) && result.length === 0)) {
        this.logger.warn(`Empty result in get`, start, { url });
      } else {
        this.logger.log(`Success get`, start, { result });
      }
      return result;
    } catch (error) {
      this.logger.error(`Error in get: ${error}`, start, { url });
      throw error;
    }
  }

  async post<T = unknown>(url: string, body: unknown): Promise<T> {
    const start = Date.now();
    try {
      const result = await this.wrapped.post<T>(url, body);
      this.logger.log(`Success post`, start, { result });
      return result;
    } catch (error) {
      this.logger.error(`Error in post: ${error}`, start, { url, body });
      throw error;
    }
  }
}
