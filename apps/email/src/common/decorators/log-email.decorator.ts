import { EmailProvider } from '../../domain/email-service.interface';
import {
  EmailConfirmationPayload,
  EmailForecastPayload,
} from '../../../../../libs/constants/types/email';
import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

function shouldLog(sampleRate: number): boolean {
  return Math.random() < sampleRate;
}

export class LogEmailServiceDecorator implements EmailProvider {
  private readonly sampleRate: number;
  constructor(
    private readonly provider: EmailProvider,
    private readonly logger: WinstonLogger,
    private readonly config: ConfigService,
  ) {
    this.sampleRate = Number(this.config.get('EMAIL_LOG_SAMPLE_RATE'));
  }

  async sendConfirmationEmail(
    payload: EmailConfirmationPayload,
  ): Promise<void> {
    const start = Date.now();
    try {
      await this.provider.sendConfirmationEmail(payload);
      if (shouldLog(this.sampleRate)) {
        this.logger.log(`Send confirmation email success`, start, {
          email: payload.email,
        });
      }
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
      if (shouldLog(this.sampleRate)) {
        this.logger.log(`Send forecast email success`, start, { payload });
      }
    } catch (error: unknown) {
      this.logger.error(`Send forecast email error`, start, {
        payload,
        error,
      });
      throw error;
    }
  }
}
