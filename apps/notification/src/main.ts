import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  await app.listen(Number(config.get<string>('PORT')));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Notification app:', err);
  process.exit(1);
});
