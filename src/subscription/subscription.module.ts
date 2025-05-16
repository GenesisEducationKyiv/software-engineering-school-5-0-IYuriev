import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService, EmailService, TokenService],
})
export class SubscriptionModule {}
