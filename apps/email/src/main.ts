import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.email' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Email app:', err);
  process.exit(1);
});
