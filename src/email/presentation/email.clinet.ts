import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from 'src/common/http/http.client';
import { EmailPayload } from 'src/constants/types/email';
import { EmailProvider } from '../domain/email-service.interface';

@Injectable()
export class EmailClient implements EmailProvider {
  private readonly BASE_URL: string;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: ConfigService,
  ) {
    this.BASE_URL = this.config.get<string>('BASE_URL') ?? '';
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    console.log(this.BASE_URL);
    await this.httpClient.post(`${this.BASE_URL}/email/confirmation`, {
      email,
      token,
    });
  }

  async sendForecastEmail(payload: EmailPayload): Promise<void> {
    await this.httpClient.post(`${this.BASE_URL}/email/forecast`, payload);
  }
}
