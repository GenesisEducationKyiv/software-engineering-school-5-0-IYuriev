import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMAIL_PACKAGE } from '../application/subscription/interfaces/email.client.interface';
import { EmailGrpcClient } from './clients/email.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EMAIL_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'email',
          protoPath: 'libs/proto/src/email.proto',
          url: 'email:4000',
        },
      },
    ]),
  ],
  providers: [EmailGrpcClient],
  exports: [EmailGrpcClient],
})
export class SubscriptionModule {}
