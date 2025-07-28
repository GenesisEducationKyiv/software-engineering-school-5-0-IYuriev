import { Module } from '@nestjs/common';
import { EmailServiceToken } from './domain/email-service.interface';
import { EmailService } from './application/use-case/email.service';
import { NodemailerService } from './infrastructure/nodemailer.service';
import { EmailController } from './presentation/email.controller';
import { HttpModule } from '../../../libs/common/http/http.module';
import { EmailTransportToken } from './application/interfaces/email-transport.interface';
import { ConfigModule } from '@nestjs/config';

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
      provide: EmailServiceToken,
      useExisting: EmailService,
    },
  ],
})
export class AppModule {}
