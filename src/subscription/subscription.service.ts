import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(dto: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });

    if (existing) throw new ConflictException('Email already subscribed');

    const subscription = await this.prisma.subscription.create({
      data: {
        email: dto.email,
        city: dto.city,
        frequency: dto.frequency,
      },
    });

    const token = await this.tokenService.createConfirmToken(subscription.id);

    await this.emailService.sendEmail(dto.email, token);

    return { message: 'Subscription successful. Confirmation email sent.' };
  }
}
