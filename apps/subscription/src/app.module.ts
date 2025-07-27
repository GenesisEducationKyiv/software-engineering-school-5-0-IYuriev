import { Module } from '@nestjs/common';
import { SubscriptionApiController } from './presentation/subscription.controller';
import { PrismaService } from './infrastucture/prisma/prisma.service';
import { SubscriptionModule } from './infrastucture/subscription.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SubscriptionModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [SubscriptionApiController],
  providers: [PrismaService],
})
export class AppModule {}
