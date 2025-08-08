import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.get<string>('KAFKA_BROKER_URL')].filter(
          Boolean,
        ) as string[],
        clientId: 'email-service',
      },
      consumer: {
        groupId: 'email-service',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(config.get<number>('HTTP_PORT')));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Email app:', err);
  process.exit(1);
});
