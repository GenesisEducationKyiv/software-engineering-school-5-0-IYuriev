import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailModule } from 'src/email/email.module';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionRepositoryToken } from './interfaces/subscription-repoository.interface';
import { TokenModule } from 'src/token/token.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [EmailModule, TokenModule, WeatherModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    PrismaService,
    SubscriptionRepository,
    {
      provide: SubscriptionRepositoryToken,
      useExisting: SubscriptionRepository,
    },
  ],
  exports: [SubscriptionRepositoryToken, SubscriptionRepository],
})
export class SubscriptionModule {}
