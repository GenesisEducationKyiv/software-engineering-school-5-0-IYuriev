import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { EmailTransportToken } from './interfaces/email-transport.interface';
import { EmailServiceToken } from './interfaces/email-service.interface';

@Module({
  providers: [
    EmailService,
    {
      provide: EmailTransportToken,
      useClass: NodemailerService,
    },
    {
      provide: EmailServiceToken,
      useClass: EmailService,
    },
  ],
  exports: [EmailTransportToken, EmailServiceToken],
})
export class EmailModule {}
