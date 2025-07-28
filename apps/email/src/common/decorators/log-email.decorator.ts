import { EmailProvider } from '../../domain/email-service.interface';
import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../../libs/constants/types/email';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';

export class LogEmailServiceDecorator implements EmailProvider {
  constructor(
    private readonly provider: EmailProvider,
    private readonly logger: WinstonLogger,
  ) {}

  async sendConfirmationEmail(
    payload: EmailConfirmationPayload,
  ): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.sendConfirmationEmail(payload);
      this.logger.log(`Send confirmation email success`, start, {
        email: payload.email,
      });
    } catch (error: unknown) {
      this.logger.error(`Send confirmation email error`, start, {
        email: payload.email,
        error,
      });
      throw error;
    }
  }

  async sendForecastEmail(payload: EmailForecastPayload): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.sendForecastEmail(payload);
      this.logger.log(`Send forecast email success`, start, { payload });
    } catch (error: unknown) {
      this.logger.error(`Send forecast email error`, start, {
        payload,
        error,
      });
      throw error;
    }
  }
}
