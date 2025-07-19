import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import {
  AppEmailClient,
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
      provide: AppEmailClient,
      useClass: EmailGrpcClient,
    },
    {
      provide: 'EmailService',
      useFactory: (client: ClientGrpc) =>
        client.getService<EmailGrpcClient>('EmailService'),
      inject: [EMAIL_PACKAGE],
    },
  ],
  exports: [AppEmailClient],
})
export class SubscriptionModule {}
