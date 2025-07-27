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
    try {
      await this.provider.sendConfirmationEmail(payload);
      this.logger.log(`Send confirmation email success`, {
        email: payload.email,
      });
    } catch (error: unknown) {
      this.logger.error(`Send confirmation email error`, {
        email: payload.email,
        error,
      });
      throw error;
    }
  }

  async sendForecastEmail(payload: EmailForecastPayload): Promise<void> {
    try {
      await this.provider.sendForecastEmail(payload);
      this.logger.log(`Send forecast email success`, { payload });
    } catch (error: unknown) {
      this.logger.error(`Send forecast email error`, {
        payload,
        error,
      });
      throw error;
    }
  }
}
