import { Module } from '@nestjs/common';
import { EmailProvider } from './domain/email-service.interface';
import { EmailService } from './application/use-case/email.service';
import { NodemailerService } from './infrastructure/nodemailer.service';
import { HttpModule } from '../../../libs/common/http/http.module';
import { EmailTransportToken } from './application/interfaces/email-transport.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailController } from './presentation/email.controller';
import { LogEmailServiceDecorator } from './common/decorators/log-email.decorator';
import { WinstonLogger } from '../../../libs/common/logger/logger.service';
import { EMAIL_SERVICE_LOGGER } from '../../../libs/common/logger/logger.module';
import { MetricsService } from './common/metrics/metrics.service';
import { MetricsEmailDecorator } from './common/decorators/metrics-email.decorator';
import { MetricsModule } from './common/metrics/metrics.module';

@Module({
  imports: [ConfigModule, HttpModule, MetricsModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    NodemailerService,
    {
      provide: EmailTransportToken,
      useExisting: NodemailerService,
    },
    {
      provide: EmailProvider,
      useFactory: (
        provider: EmailService,
        metrics: MetricsService,
        logger: WinstonLogger,
        config: ConfigService,
      ) => {
        const metricsDecorator = new MetricsEmailDecorator(provider, metrics);
        return new LogEmailServiceDecorator(metricsDecorator, logger, config);
      },
      inject: [
        EmailService,
        MetricsService,
        EMAIL_SERVICE_LOGGER,
        ConfigService,
      ],
    },
  ],
})
export class AppModule {}
