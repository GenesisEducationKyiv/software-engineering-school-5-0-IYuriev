import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WinstonLogger));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
