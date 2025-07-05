import { Module } from '@nestjs/common';
import { EmailServiceToken } from 'src/core/email/email-service.interface';
import { EmailTransportToken } from 'src/core/email/email-transport.interface';
import { EmailService } from 'src/infrastructure/email/email.service';
import { NodemailerService } from 'src/infrastructure/email/nodemailer.service';

@Module({
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
  exports: [EmailTransportToken, EmailServiceToken],
})
export class EmailModule {}
