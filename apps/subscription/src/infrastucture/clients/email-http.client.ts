import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../../libs/common/http/http.client';

@Injectable()
export class EmailHttpClient {
  constructor(private readonly http: HttpClient) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    await this.http.post('http://email:4000/email/confirmation', {
      email,
      token,
    });
  }
}
