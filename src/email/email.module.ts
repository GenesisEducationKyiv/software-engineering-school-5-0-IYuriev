import { Module } from '@nestjs/common';
import { EmailServiceToken } from 'src/email/domain/email-service.interface';
import { EmailTransportToken } from 'src/email/application/interfaces/email-transport.interface';
import { EmailService } from 'src/email/application/use-case/email.service';
import { NodemailerService } from 'src/email/infrastructure/nodemailer.service';
import { EmailClient } from './presentation/email.clinet';
import { HttpModule } from 'src/common/http/http.module';
import { EmailController } from './presentation/email.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    NodemailerService,
    EmailClient,
    {
      provide: EmailTransportToken,
      useExisting: NodemailerService,
    },
    {
      provide: EmailServiceToken,
      useExisting: EmailService,
    },
  ],
  exports: [EmailClient],
})
export class EmailModule {}
