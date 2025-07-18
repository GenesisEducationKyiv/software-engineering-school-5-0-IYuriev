import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from '../../../libs/common/logger/logger.service';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from '../../../libs/common/filters/exception.filter';
dotenv.config({ path: '.env.gateway' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  app.useLogger(app.get(WinstonLogger));

  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://weather-subscription-service.vercel.app',
      'http://host.docker.internal:8080',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  await app.listen(Number(process.env.PORT));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Gateway:', err);
  process.exit(1);
});
