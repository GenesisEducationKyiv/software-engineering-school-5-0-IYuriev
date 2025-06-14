import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { CityModule } from 'src/city/city.module';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionRepositoryToken } from './interfaces/subscription-repoository.interface';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [CityModule, EmailModule, TokenModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    PrismaService,
    TokenService,
    SubscriptionRepository,
    {
      provide: SubscriptionRepositoryToken,
      useClass: SubscriptionRepository,
    },
  ],
})
export class SubscriptionModule {}
