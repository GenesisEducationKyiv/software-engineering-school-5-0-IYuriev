import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'subscription',
      protoPath: join(__dirname, '../../../libs/proto/src/subscription.proto'),
      url: `${config.get<string>('GRPC_URL')}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(config.get<number>('HTTP_PORT')));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Subscription app:', err);
  process.exit(1);
});
