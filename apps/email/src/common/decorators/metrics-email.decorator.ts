import { EmailProvider } from '../../domain/email-service.interface';
import { MetricsService } from '../metrics/metrics.service';
import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../../libs/constants/types/email';

export class MetricsEmailDecorator implements EmailProvider {
  constructor(
    private readonly provider: EmailProvider,
    private readonly metrics: MetricsService,
  ) {}

  async sendConfirmationEmail(
    payload: EmailConfirmationPayload,
  ): Promise<void> {
    try {
      await this.provider.sendConfirmationEmail(payload);
      this.metrics.incConfirmationSuccess();
    } catch (error) {
      this.metrics.incConfirmationError();
      throw error;
    }
  }

  async sendForecastEmail(payload: EmailForecastPayload): Promise<void> {
    try {
      await this.provider.sendForecastEmail(payload);
      this.metrics.incForecastSuccess();
    } catch (error) {
      this.metrics.incForecastError();
      throw error;
    }
  }
}
