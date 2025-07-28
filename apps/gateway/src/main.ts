import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from '../../../libs/common/logger/logger.service';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from '../../../libs/common/filters/exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  app.useLogger(app.get(WinstonLogger));

  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  await app.listen(Number(config.get<string>('PORT')));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap in Gateway:', err);
  process.exit(1);
});
