import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
dotenv.config({ path: '.env.email' });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER_URL].filter(Boolean) as string[],
          clientId: 'email-service',
        },
        consumer: {
          groupId: 'email-service',
        },
      },
    },
  );
  await app.listen();
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap in Email app:', err);
  process.exit(1);
});
