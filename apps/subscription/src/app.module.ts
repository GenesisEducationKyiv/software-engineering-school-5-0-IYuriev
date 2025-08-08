import { Module } from '@nestjs/common';
import { SubscriptionApiController } from './presentation/subscription.controller';
import { PrismaService } from './infrastucture/prisma/prisma.service';
import { SubscriptionModule } from './infrastucture/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { MetricsModule } from './common/metrics/metrics.module';

@Module({
  imports: [
    SubscriptionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MetricsModule,
  ],
  controllers: [SubscriptionApiController],
  providers: [PrismaService],
})
export class AppModule {}
