import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailPublisher } from './publishers/email.publisher';
import { EmailPublish } from '../application/subscription/interfaces/email.publisher.interface';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [config.get<string>('KAFKA_BROKER_URL')].filter(
                Boolean,
              ) as string[],
            },
            consumer: {
              groupId: 'subscription-service',
            },
            producer: {
              allowAutoTopicCreation: true,
            },
            producerOnlyMode: true,
          },
        }),

        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: EmailPublish,
      useClass: EmailPublisher,
    },
  ],
  exports: [EmailPublish],
})
export class SubscriptionModule {}
