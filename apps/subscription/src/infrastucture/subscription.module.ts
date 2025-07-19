import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  APP_EMAIL_CLIENT,
  EMAIL_PACKAGE,
} from '../application/subscription/interfaces/email.client.interface';
import { EmailGrpcClient } from './clients/email.client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: EMAIL_PACKAGE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'email',
            protoPath: 'libs/proto/src/email.proto',
            url: config.get<string>('EMAIL_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_EMAIL_CLIENT,
      useClass: EmailGrpcClient,
    },
  ],
  exports: [APP_EMAIL_CLIENT],
})
export class SubscriptionModule {}
