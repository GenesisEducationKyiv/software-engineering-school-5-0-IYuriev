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
      package: 'weather',
      protoPath: join(__dirname, '../../../libs/proto/src/weather.proto'),
      url: `0.0.0.0:${config.get<string>('PORT')}`,
    },
  });

  await app.startAllMicroservices();
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Weather app:', err);
  process.exit(1);
});
