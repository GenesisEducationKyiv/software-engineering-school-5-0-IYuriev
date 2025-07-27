import { Module } from '@nestjs/common';
import { EmailProvider } from './domain/email-service.interface';
import { EmailService } from './application/use-case/email.service';
import { NodemailerService } from './infrastructure/nodemailer.service';
import { HttpModule } from '../../../libs/common/http/http.module';
import { EmailTransportToken } from './application/interfaces/email-transport.interface';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './presentation/email.controller';
import { LogEmailServiceDecorator } from './common/decorators/log-email-service.decorator';
import { WinstonLogger } from '../../../libs/common/logger/logger.service';
import { EMAIL_SERVICE_LOGGER } from '../../../libs/common/logger/logger.module';

@Module({
  imports: [ConfigModule, HttpModule],
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
      useFactory: (provider: EmailService, logger: WinstonLogger) =>
        new LogEmailServiceDecorator(provider, logger),
      inject: [EmailService, EMAIL_SERVICE_LOGGER],
    },
  ],
})
export class AppModule {}
