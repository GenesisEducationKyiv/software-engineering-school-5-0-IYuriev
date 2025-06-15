import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { EmailTransportToken } from './interfaces/email-transport.interface';
import { EmailServiceToken } from './interfaces/email-service.interface';

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
