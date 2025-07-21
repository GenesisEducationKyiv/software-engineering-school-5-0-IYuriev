import { Module } from '@nestjs/common';
import { SubscriptionService } from '../subscription/use-cases/subscription.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { WeatherModule } from 'src/application/modules/weather.module';
import { EmailModule } from './email.module';
import { TokenModule } from './token.module';
import { SubscriptionController } from '../../presentation/subscription/subscription.controller';
import { SubscriptionRepository } from 'src/infrastructure/subscription/subscription.repository';
import { SubscriptionRepositoryToken } from 'src/application/subscription/interfaces/subscription-repoository.interface';

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
