import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';
import { EmailPayload } from '../../../../../libs/constants/types/email';

@Injectable()
export class EmailHttpClient {
  constructor(private readonly http: HttpClient) {}

  async sendForecastEmail(payload: EmailPayload): Promise<void> {
    await this.http.post('http://email:4000/email/forecast', {
      payload,
    });
  }
}
